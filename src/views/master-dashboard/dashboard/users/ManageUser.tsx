/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage user Page to handle the users.
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
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  Switch,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import MyAvatar from 'components/MyAvatar';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray, updateItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { apiBaseUrl } from 'config/config';
import { ShortRoleModel, UserProfileModel } from 'models/master';
import { getRolesRequest } from 'services/master/role';
import {
  deleteUserRequest,
  getUsersRequest,
  updateUserStatusRequest
} from 'services/master/user';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addUserPath = PAGE_ADMIN_DASHBOARD.users.create.relativePath;
const editUserPath = PAGE_ADMIN_DASHBOARD.users.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this user?</>,
  userId: 0
};
const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this user's status?</>,
  userId: 0,
  isActive: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the user listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageUser = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<UserProfileModel>>([]);
  const [originalData, setOriginalData] = useState<Array<UserProfileModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [roles, setRoles] = useState<Array<ShortRoleModel>>([]);
  const [filters, setFilters] = useState({
    roleId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} userId - id of selected role to delete
   * @param {string} name - name of selected role to confirm
   * @returns {void}
   */
  const handleOpenDialog = (userId: number, name: string): void => {
    setDeleteDialog({
      open: true,
      title: (
        <>
          <b>Delete {name}</b>
        </>
      ),
      description: <>Are you sure you want to delete this user?</>,
      userId
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
   * @param {number} userId - id of selected user to update status
   * @param {string} userName - name of selected user to confirm
   * @param {boolean|null|undefined} isActive - active status of selected user to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    userId: number,
    userName: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this user'
        : 'Are you sure you want to activate this user'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{userName}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title: isActive === true ? <>Deactivate User</> : <>Activate User</>,
      description: popupdesc,
      userId,
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
   * function to delete the user with backend action
   *
   * @param {number} userId - id of selected user to delete
   * @returns {void}
   */
  const handleDeleteUser = async (userId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteUserRequest(userId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.userDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', userId));
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
   * function to get all the users with backend action
   *
   * @returns {void}
   */
  const handleGetUsers = async (): Promise<void> => {
    try {
      const response = await getUsersRequest();
      if (response?.status.response_code === 200) {
        setRows(response.users || []);
        setOriginalData(response.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the roles with backend action
   *
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    try {
      const response = await getRolesRequest();
      if (response?.status.response_code === 200) {
        setRoles(response.roles || []);
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
   * @param {number} userId - id of the current user.
   * @param {any} isUserActive - status of the current user.
   * @returns {void}
   */
  const handleUpdateActiveUser = async (
    userId: number,
    isUserActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isUserActive,
        modifiedBy: user.id
      };
      const response = await updateUserStatusRequest(userId, requestData);
      if (response && response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.userStatusUpdated,
          'success'
        );

        setRows(
          updateItemFromArray(rows, 'id', userId, 'is_active', !!isUserActive)
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
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.roleId) {
      updatedRows = updatedRows.filter((item) =>
        item.roles.map((ritem) => String(ritem.id)).includes(filters.roleId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.first_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.last_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.email.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          (item.phone || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'profile_photo',
      headerName: 'Profile Image',
      width: 120,
      headerAlign: 'center',
      renderCell: (params: UserProfileModel) => (
        <MyAvatar
          src={`${apiBaseUrl}${params.profile_photo}`}
          width="80px"
          height="80px"
          sx={adminStyle.tableProfileAvatar}
        />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      flex: 1,
      renderCell: (params: UserProfileModel) =>
        `${params.first_name} ${params.last_name}`
    },
    {
      field: 'email',
      headerName: 'Email Address',
      sortable: true,
      width: 230
    },
    {
      field: 'phone',
      headerName: 'Phone No.',
      sortable: true,
      width: 130
    },
    {
      field: 'Roles',
      headerName: 'Assigned Roles',
      sortable: false,
      width: 210,
      renderCell: (params: UserProfileModel) => (
        <List disablePadding>
          {params.roles.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ChevronRightIcon />
              <span>{item.name}</span>
            </ListItem>
          ))}
        </List>
      )
    },
    {
      field: 'is_active',
      headerName: 'Allow SignIn',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: UserProfileModel) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!params.is_active}
              onChange={() => {
                handleOpenStatusDialog(
                  params.id,
                  `${params.first_name} ${params.last_name}`,
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
      renderCell: (params: UserProfileModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editUserPath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() =>
                  handleOpenDialog(
                    params.id,
                    `${params.first_name} ${params.last_name}`
                  )
                }
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
    handleGetUsers();
    handleGetRoles();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Users">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={5} md={6}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addUserPath)}
          >
            Add User
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Role"
            size="small"
            value={filters.roleId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, roleId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {roles.map((option: ShortRoleModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
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
        onAgreeAction={() => handleDeleteUser(deleteDialog.userId)}
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
          handleUpdateActiveUser(statusDialog.userId, statusDialog.isActive)
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageUser;
