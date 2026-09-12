/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage order Page to handle the orders.
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
import { OrderModel, ShortCompanyModel, ShortPlanModel } from 'models/master';
import { getOrdersRequest } from 'services/master/order';
import { getCompaniesRequest } from 'services/master/company';
import { getPlansRequest } from 'services/master/plan';

// ----------------------------------------------------------------------

/**
 * Component to create the order listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageOrder = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<OrderModel>>([]);
  const [originalData, setOriginalData] = useState<Array<OrderModel>>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Array<ShortCompanyModel>>([]);
  const [plans, setPlans] = useState<Array<ShortPlanModel>>([]);
  const [filters, setFilters] = useState({
    companyId: '',
    planId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to get all the orders with backend action
   *
   * @returns {void}
   */
  const handleGetOrders = async (): Promise<void> => {
    try {
      const response = await getOrdersRequest();
      if (response?.status.response_code === 200) {
        setRows(response.orders || []);
        setOriginalData(response.orders || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the company with backend action
   *
   * @returns {void}
   */
  const handleGetCompanies = async (): Promise<void> => {
    try {
      const response = await getCompaniesRequest();
      if (response?.status.response_code === 200) {
        setCompanies(response.companies || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
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
        setPlans(response.plans || []);
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

    if (filters.companyId) {
      updatedRows = updatedRows.filter(
        (item) => String(item.company.id) === String(filters.companyId)
      );
    }

    if (filters.planId) {
      updatedRows = updatedRows.filter(
        (item) => String(item.plan.id) === String(filters.planId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.user_count
            .toString()
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.duration
            .toString()
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.gross_total
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.discount
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.gst.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          item.total.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'id',
      headerName: 'Order Id',
      width: 100
    },
    {
      field: 'company',
      headerName: 'Company Name',
      sortable: true,
      width: 250,
      renderCell: (params: OrderModel) => params.company.name
    },
    {
      field: 'plan',
      headerName: 'Plan',
      sortable: true,
      width: 200,
      renderCell: (params: OrderModel) => params.plan.name
    },
    {
      field: 'duration',
      headerName: 'Plan Duration',
      sortable: true,
      width: 150
    },
    {
      field: 'user_count',
      headerName: 'User Count',
      sortable: true,
      width: 150
    },
    {
      field: 'is_addon',
      headerName: 'Is Addon',
      sortable: true,
      width: 120,
      renderCell: (params: OrderModel) => (params.is_addon ? 'Yes' : 'No')
    },
    {
      field: 'is_success',
      headerName: 'Is Success',
      sortable: true,
      width: 130,
      renderCell: (params: OrderModel) => (params.is_success ? 'Yes' : 'No')
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      sortable: true,
      width: 120
    }
  ];

  /* Side-Effects */
  useEffect(() => {
    handleGetOrders();
    handleGetCompanies();
    handleGetPlans();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Orders">
      <Grid container spacing={2} mb={3} justifyContent="flex-end">
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Company"
            size="small"
            value={filters.companyId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, companyId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {companies.map((option: ShortCompanyModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TextField
            select
            fullWidth
            label="Select Plan"
            size="small"
            value={filters.planId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, planId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {plans.map((option: ShortPlanModel) => (
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
    </AdminDashboardPage>
  );
};

export default ManageOrder;
