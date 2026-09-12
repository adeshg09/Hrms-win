/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage project page to handle the project.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import MenuPopover from 'components/MenuPopover';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray, updateItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { ClientModel, ProjectModel, ShortUserModel } from 'models/company';
import { getClientsRequest } from 'services/company/client';
import { getUsersByCompanyIdRequest } from 'services/master/user';
import {
  deleteProjectRequest,
  getProjectRequest,
  updateProjectStatusRequest
} from 'services/company/project';

/* Local Imports */
import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* Constants */
const addProjectPath = PAGE_COMPANY_DASHBOARD.projects.create.relativePath;
const editProjectPath = PAGE_COMPANY_DASHBOARD.projects.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this project?</>,
  projectId: 0
};
const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this project's status?</>,
  projectId: 0,
  isActive: 0
};
const initialStateViewPopover = {
  open: false,
  data: null
};

// ----------------------------------------------------------------------

/**
 * Component to create the project listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageProject = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<ProjectModel>>([]);
  const [originalData, setOriginalData] = useState<Array<ProjectModel>>([]);
  const [clients, setClients] = useState<Array<ClientModel>>([]);
  const [users, setUsers] = useState<Array<ShortUserModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewPopover, setViewPopover] = useState<any>(initialStateViewPopover);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    projectManagerId: '',
    clientId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} projectId - id of selected project to delete
   * @param {string} projectName - name of selected project to confirm
   * @returns {void}
   */
  const handleOpenDialog = (projectId: number, projectName: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {projectName}</b>,
      description: <>Are you sure you want to delete this project?</>,
      projectId
    });
  };

  /**
   * function to close the delete dialog box
   *
   * @returns {void}
   */
  const handleCloseDialog = (): void => {
    setDeleteDialog(initialStateDeleteDialog);
  };

  /**
   * function to open the status dialog box
   *
   * @param {number} projectId - id of selected project to update status
   * @param {string} projectName - name of selected project to confirm
   * @param {boolean|null|undefined} isActive - active status of selected project to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    projectId: number,
    projectName: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this project'
        : 'Are you sure you want to activate this project'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{projectName}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title:
        isActive === true ? <>Deactivate Project</> : <>Activate Project</>,
      description: popupdesc,
      projectId,
      isActive: isActive === true ? 0 : 1
    });
  };

  /**
   * function to close the status dialog box
   *
   * @returns {void}
   */
  const handleCloseStatusDialog = (): void => {
    setStatusDialog(initialStateStatusDialog);
  };

  /**
   * function to open the view popover
   *
   * @param {object} event - event of selected lead to view
   * @param {object} data - data of selected lead to view
   * @returns {void}
   */
  const handleOpenPopover = (event: any, data: any): void => {
    setAnchorEl(event.currentTarget);
    setViewPopover({
      open: true,
      data
    });
  };

  /**
   * function to close the view popover
   *
   * @returns {void}
   */
  const handleClosePopover = (): void => {
    setAnchorEl(null);
    setViewPopover(initialStateViewPopover);
  };

  /**
   * function to delete the project with backend action
   *
   * @param {number} projectId - id of selected project to delete
   * @returns {void}
   */

  const handleDeleteProject = async (projectId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteProjectRequest(projectId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.projectDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', projectId));
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseDialog();
  };

  /**
   * function to get all the projects with backend action
   *
   * @returns {void}
   */
  const handleGetProjects = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getProjectRequest();
      if (response?.status.response_code === 200) {
        setRows(response.projects || []);
        setOriginalData(response.projects || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the users with backend action
   *
   * @returns {void}
   */
  const handleGetUsers = async (): Promise<void> => {
    try {
      const response = await getUsersByCompanyIdRequest(user.company?.id);
      if (response?.status.response_code === 200) {
        setUsers(response.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the clients with backend action
   *
   * @returns {void}
   */
  const handleGetClients = async (): Promise<void> => {
    try {
      const response = await getClientsRequest();
      if (response?.status.response_code === 200) {
        setClients(response.clients || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.projectManagerId) {
      updatedRows = updatedRows.filter(
        (item) =>
          String(item.project_manager.id) === String(filters.projectManagerId)
      );
    }

    if (filters.clientId) {
      updatedRows = updatedRows.filter(
        (item) => String(item.client?.id) === String(filters.clientId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.name.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          (item.project_manager.first_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.project_manager.last_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.team_leader.first_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.team_leader.last_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.client?.name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /**
   * function to update active state
   *
   * @param {number} projectId - id of the current project.
   * @param {any} isProjectActive - status of the current project.
   * @returns {void}
   */
  const handleUpdateProjectStatus = async (
    projectId: number,
    isProjectActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isProjectActive,
        modifiedBy: user.id
      };
      const response = await updateProjectStatusRequest(projectId, requestData);
      if (response && response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.projectStatusUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(
            rows,
            'id',
            projectId,
            'is_active',
            !!isProjectActive
          )
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseStatusDialog();
  };

  const viewItem = (title: any, value: any): JSX.Element => (
    <Grid container spacing={2}>
      <Grid item md={4} sm={4} xs={12}>
        <Typography variant="h6" pr={2} sx={adminStyle.viewItemTitle}>
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={12}>
        <Typography variant="body1" sx={adminStyle.viewItemBody}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
  /* Columns */
  const columns = [
    {
      field: 'name',
      headerName: 'Project Name',
      sortable: true,
      flex: 1
    },
    {
      field: 'tr_client',
      headerName: 'Client',
      sortable: true,
      width: 200,
      renderCell: (params: ProjectModel) => params.client?.name || '-'
    },
    {
      field: 'project_manager',
      headerName: 'Project Manager',
      sortable: true,
      width: 200,
      renderCell: (params: ProjectModel) =>
        `${params.project_manager.first_name} ${params.project_manager.last_name}`
    },
    {
      field: 'team_leader',
      headerName: 'Team Leader',
      sortable: true,
      width: 200,
      renderCell: (params: ProjectModel) =>
        `${params.team_leader.first_name} ${params.team_leader.last_name}`
    },
    {
      field: 'is_active',
      headerName: 'Status',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params: ProjectModel) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!params.is_active}
              onChange={() => {
                handleOpenStatusDialog(
                  params.id,
                  params.name,
                  params.is_active
                );
              }}
            />
          }
          label=""
        />
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: ProjectModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="default"
                aria-label="view"
                onClick={(e) => handleOpenPopover(e, params)}
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editProjectPath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handleOpenDialog(params.id, params.name)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </>
      )
    }
  ];

  /* Side-Effects */
  useEffect(() => {
    handleGetProjects();
    handleGetUsers();
    handleGetClients();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Projects">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={3} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addProjectPath)}
          >
            Add Project
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Project Manager"
            size="small"
            value={filters.projectManagerId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, projectManagerId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {users.map((option: ShortUserModel) => (
              <option key={option.id} value={option.id}>
                {option.first_name} {option.last_name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Client"
            size="small"
            value={filters.clientId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, clientId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {clients.map((option: ClientModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            fullWidth
            label="Search"
            size="small"
            value={filters.searchText}
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            onChange={(e) => {
              setFilters({ ...filters, searchText: e.target.value });
            }}
          />
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        totalRow={rows.length}
        isLoading={loading}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        description={deleteDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Delete"
        disagreeText="Cancel"
        onAgreeAction={() => handleDeleteProject(deleteDialog.projectId)}
        onDisAgreeAction={handleCloseDialog}
      />
      <ConfirmDialog
        open={statusDialog.open}
        title={statusDialog.title}
        description={statusDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Yes"
        disagreeText="No"
        onAgreeAction={() =>
          handleUpdateProjectStatus(
            statusDialog.projectId,
            statusDialog.isActive
          )
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
      <MenuPopover
        id="view"
        open={viewPopover.open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        contentStyle={adminStyle.viewPopover}
      >
        {viewPopover.data && (
          <Box sx={adminStyle.popoverView}>
            <Box sx={adminStyle.closePopover}>
              <IconButton onClick={handleClosePopover} sx={adminStyle.mbottom}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={3} sx={adminStyle.popoverMainBox}>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Project Name', viewPopover.data.name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Description',
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(viewPopover.data.description)
                    }}
                    sx={adminStyle.viewItemDescriptionBody}
                  />
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Project Manager',
                  `${viewPopover.data.project_manager.first_name} ${viewPopover.data.project_manager.last_name}`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Team Leader',
                  `${viewPopover.data.team_leader.first_name} ${viewPopover.data.team_leader.last_name}`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Client Name', viewPopover.data.client?.name || '-')}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Client Country',
                  viewPopover.data.client?.country || '-'
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Team Members',
                  <>
                    {viewPopover.data.team_members.map((item: any) => (
                      <Typography key={item.id}>
                        {`${item.first_name} ${item.last_name}`}
                      </Typography>
                    ))}
                  </>
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Estimated Time',
                  `${viewPopover.data.estimate_time} hrs`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Start Date', viewPopover.data.start_date)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('End Date', viewPopover.data.end_date)}
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                {viewPopover.data.is_active ? (
                  <>{viewItem('Status', 'Active')}</>
                ) : (
                  <>{viewItem('Status', 'In-Active')}</>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </MenuPopover>
    </AdminDashboardPage>
  );
};

export default ManageProject;
