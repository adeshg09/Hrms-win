/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage role Page to handle the roles.
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
  Grid,
  IconButton,
  List,
  ListItem,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { RoleModel } from 'models/company';
import { deleteRoleRequest, getRolesRequest } from 'services/company/role';

/* Local Imports */
import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* Constants */
const addRolePath = PAGE_COMPANY_DASHBOARD.roles.create.relativePath;
const editRolePath = PAGE_COMPANY_DASHBOARD.roles.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this role?</>,
  roleId: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the role listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageRole = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<RoleModel>>([]);
  const [originalData, setOriginalData] = useState<Array<RoleModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} roleId - id of selected role to delete
   * @param {string} roleName - name of selected role to confirm
   * @returns {void}
   */
  // const handleOpenDialog = (roleId: number, roleName: string): void => {
  //   setDeleteDialog({
  //     open: true,
  //     title: <b>Delete {roleName}</b>,
  //     description: <>Are you sure you want to delete this role?</>,
  //     roleId
  //   });
  // };

  /**
   * function to close the delete dialog box
   *
   * @returns {void}
   */
  const handleCloseDialog = (): void => {
    setDeleteDialog(initialStateDeleteDialog);
  };

  const handleOpenDialog = (id: number): void => {
    setDeleteDialog({
      open: true,
      title: <>Delete</>,
      description: <>Are you sure you want to delete this role?</>,
      roleId: id
    });
  };

  /**
   * function to delete the role with backend action
   *
   * @param {number} roleId - id of selected role to delete
   * @returns {void}
   */
  const handleDeleteRole = async (roleId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteRoleRequest(roleId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.roleDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', roleId));
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
   * function to get all the roles with backend action
   *
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    try {
      const response = await getRolesRequest();
      if (response?.status.response_code === 200) {
        setRows(response.roles || []);
        setOriginalData(response.roles || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.name.toLowerCase().indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'name',
      headerName: 'Role Name',
      sortable: true,
      width: 200
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      flex: 1
    },
    {
      field: 'Sub Modules',
      headerName: 'Sub Modules',
      sortable: false,
      width: 210,
      renderCell: (params: any) => (
        <List disablePadding>
          {params?.subModules?.map((item: any) => (
            <ListItem key={item.id} disablePadding>
              <ChevronRightIcon />
              <span>{item.display_name}</span>
            </ListItem>
          ))}
        </List>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: RoleModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editRolePath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              {![1, 2, 3].includes(params.id) && (
                <IconButton
                  size="small"
                  color="error"
                  aria-label="delete"
                  onClick={() => handleOpenDialog(params.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </>
      )
    }
  ];

  /* Side-Effects */
  useEffect(() => {
    handleGetRoles();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Roles">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addRolePath)}
          >
            Add Role
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
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
        onAgreeAction={() => handleDeleteRole(deleteDialog.roleId)}
        onDisAgreeAction={handleCloseDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageRole;
