/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage plan page to handle the plan.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DOMPurify from 'dompurify';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import MenuPopover from 'components/MenuPopover';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray, updateItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { PlanModel, ShortModuleModel } from 'models/master';
import {
  deletePlanRequest,
  getPlansRequest,
  updatePlanStatusRequest,
  updatePlanVisibilityRequest
} from 'services/master/plan';
import { getModulesRequest } from 'services/master/module';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addPlanPath = PAGE_ADMIN_DASHBOARD.plans.create.relativePath;
const editPlanPath = PAGE_ADMIN_DASHBOARD.plans.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this plan?</>,
  planId: 0
};
const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this plan's status?</>,
  planId: 0,
  isActive: 0
};
const initialStateVisibilityDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this plan's visibility?</>,
  planId: 0,
  isVisible: 0
};

const initialStateViewPopover = {
  open: false,
  data: null
};

// ----------------------------------------------------------------------

/**
 * Component to create the plan listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManagePlan = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<PlanModel>>([]);
  const [originalData, setOriginalData] = useState<Array<PlanModel>>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewPopover, setViewPopover] = useState<any>(initialStateViewPopover);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [visibilityDialog, setVisibilityDialog] = useState(
    initialStateVisibilityDialog
  );
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [modules, setModules] = useState<Array<ShortModuleModel>>([]);
  const [filters, setFilters] = useState({
    moduleId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} planId - id of selected plan to delete
   * @param {string} planName - name of selected plan to confirm
   * @returns {void}
   */
  const handleOpenDialog = (planId: number, planName: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {planName}</b>,
      description: <>Are you sure you want to delete this plan?</>,
      planId
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
   * @param {number} planId - id of selected plan to update status
   * @param {string} planName - name of selected plan to confirm
   * @param {boolean|null|undefined} isActive - active status of selected plan to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    planId: number,
    planName: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this plan'
        : 'Are you sure you want to activate this plan'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{planName}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title: isActive === true ? <>Deactivate Plan</> : <>Activate Plan</>,
      description: popupdesc,
      planId,
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
   * function to open the visibility dialog box
   *
   * @param {number} planId - id of selected plan to update visibility
   * @param {string} planName - name of selected plan to confirm
   * @param {boolean|null|undefined} isVisible - visible status of selected plan to update
   * @returns {void}
   */
  const handleOpenVisibilityDialog = (
    planId: number,
    planName: string,
    isVisible: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isVisible === true
        ? 'Are you sure you want to deactivate visibility of this plan'
        : 'Are you sure you want to activate visibility of this plan'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{planName}"</b>?
      </>
    );
    setVisibilityDialog({
      open: true,
      title:
        isVisible === true ? (
          <>Deactivate Plan Visibility</>
        ) : (
          <>Activate Plan Visibility</>
        ),
      description: popupdesc,
      planId,
      isVisible: isVisible === true ? 0 : 1
    });
  };

  /**
   * function to close the visibility dialog box
   *
   * @returns {void}
   */
  const handleCloseVisibilityDialog = (): void => {
    setVisibilityDialog(initialStateVisibilityDialog);
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
   * function to delete the plan with backend action
   *
   * @param {number} planId - id of selected plan to delete
   * @returns {void}
   */
  const handleDeletePlan = async (planId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deletePlanRequest(planId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.planDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', planId));
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
   * function to get all the plan with backend action
   *
   * @returns {void}
   */
  const handleGetPlans = async (): Promise<void> => {
    try {
      const response = await getPlansRequest();
      if (response?.status.response_code === 200) {
        setRows(response.plans || []);
        setOriginalData(response.plans || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the modules with backend action
   *
   * @returns {void}
   */
  const handleGetModules = async (): Promise<void> => {
    try {
      const response = await getModulesRequest();
      if (response?.status.response_code === 200) {
        setModules(response.modules || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to update active state
   *
   * @param {number} plantId - id of the current plan.
   * @param {any} isPlanActive - status of the current plan.
   * @returns {void}
   */
  const handleUpdateActivePlan = async (
    planId: number,
    isPlanActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isPlanActive,
        modifiedBy: user.id
      };
      const response = await updatePlanStatusRequest(planId, requestData);
      if (response && response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.planStatusUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(rows, 'id', planId, 'is_active', !!isPlanActive)
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

  /**
   * function to update visible state
   *
   * @param {number} planId - id of the current plan.
   * @param {any} isPlanVisible - visibility of the current plan.
   * @returns {void}
   */
  const handleUpdateVisiblePlan = async (
    planId: number,
    isPlanVisible: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isVisible: isPlanVisible,
        modifiedBy: user.id
      };
      const response = await updatePlanVisibilityRequest(planId, requestData);
      if (response && response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.planVisibilityUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(rows, 'id', planId, 'is_visible', !!isPlanVisible)
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handleCloseVisibilityDialog();
  };

  /**
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.moduleId) {
      updatedRows = updatedRows.filter((item) =>
        item.modules.map((ritem) => String(ritem.id)).includes(filters.moduleId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.name.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          item.summary.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          item.description
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.actual_price || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.visible_price
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  const viewItem = (title: any, value: any): JSX.Element => (
    <Grid container spacing={3}>
      <Grid item md={4} sm={4} xs={12}>
        <Typography variant="h6" pr={2} sx={adminStyle.viewItemTitle}>
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={12}>
        <Typography variant="body1" ml={5} sx={adminStyle.viewItemBody}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );

  /* Columns */
  const columns = [
    {
      field: 'name',
      headerName: 'Plan Name',
      sortable: true,
      width: 140
    },
    {
      field: 'summary',
      headerName: 'Summary',
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <Typography sx={adminStyle.ellipsis}>
          <>{params.summary}</>
        </Typography>
      )
    },
    {
      field: 'actual_price',
      headerName: 'Actual Price',
      sortable: true,
      width: 140
    },
    {
      field: 'visible_price',
      headerName: 'Visible Price',
      sortable: true,
      width: 140
    },
    {
      field: 'is_visible',
      headerName: 'Visibility',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: PlanModel) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!params.is_visible}
              onChange={() => {
                handleOpenVisibilityDialog(
                  params.id,
                  params.name,
                  params.is_visible
                );
              }}
            />
          }
          label=""
          sx={adminStyle.tableFormControlLabel}
        />
      )
    },
    {
      field: 'is_active',
      headerName: 'Status',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 110,
      renderCell: (params: PlanModel) => (
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
          sx={adminStyle.tableFormControlLabel}
        />
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: PlanModel) => (
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
                  navigate(editPlanPath.replace(':id', `${params.id}`))
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
    handleGetPlans();
    handleGetModules();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plans">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={5} md={6}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addPlanPath)}
          >
            Add Plan
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Module"
            size="small"
            value={filters.moduleId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, moduleId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {modules.map((option: ShortModuleModel) => (
              <option key={option.id} value={option.id}>
                {option.display_name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            label="Search"
            size="small"
            value={filters.searchText}
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            onChange={(e: any) => {
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
        onAgreeAction={() => handleDeletePlan(deleteDialog.planId)}
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
          handleUpdateActivePlan(statusDialog.planId, statusDialog.isActive)
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
      <ConfirmDialog
        open={visibilityDialog.open}
        title={visibilityDialog.title}
        description={visibilityDialog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Yes"
        disagreeText="No"
        onAgreeAction={() =>
          handleUpdateVisiblePlan(
            visibilityDialog.planId,
            visibilityDialog.isVisible
          )
        }
        onDisAgreeAction={handleCloseVisibilityDialog}
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
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Plan Name', viewPopover.data.name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Summary', viewPopover.data.summary)}
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
                {viewItem('Actual Price', viewPopover.data.actual_price)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Visible Price', viewPopover.data.visible_price)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewPopover.data.is_visible ? (
                  <>{viewItem('Visibility', 'yes')}</>
                ) : (
                  <>{viewItem('Visibility', 'no')}</>
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewPopover.data.is_active ? (
                  <>{viewItem('Active Status', 'yes')}</>
                ) : (
                  <>{viewItem('Active Status', 'no')}</>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </MenuPopover>
    </AdminDashboardPage>
  );
};

export default ManagePlan;
