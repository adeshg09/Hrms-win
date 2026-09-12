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
import { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';

/* Relative Imports */
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { RoleModel } from 'models/master';
import { getRolesRequest } from 'services/master/role';

// ----------------------------------------------------------------------

/**
 * Component to create the role listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageRole = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<RoleModel>>([]);
  const [originalData, setOriginalData] = useState<Array<RoleModel>>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchText: ''
  });

  /* Functions */
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
        <Grid item xs={12} sm={8} md={9} />
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
    </AdminDashboardPage>
  );
};

export default ManageRole;
