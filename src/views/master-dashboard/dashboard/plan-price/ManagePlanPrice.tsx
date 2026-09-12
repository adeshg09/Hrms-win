/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage plan price page to handle the plan prices.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 20/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

/* Relative Imports */

import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import {
  PlanPriceModel,
  ShortPlanDurationModel,
  ShortPlanModel
} from 'models/master';
import {
  deletePlanPriceRequest,
  getPlanPricesRequest
} from 'services/master/planPrice';
import { getPlansRequest } from 'services/master/plan';
import { getPlanDurationsRequest } from 'services/master/planDuration';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addPlanPricePath = PAGE_ADMIN_DASHBOARD.planPrice.create.relativePath;
const editPlanPricePath = PAGE_ADMIN_DASHBOARD.planPrice.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this plan price?</>,
  planPriceId: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the planPrice listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManagePlanPrice = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<PlanPriceModel>>([]);
  const [originalData, setOriginalData] = useState<Array<PlanPriceModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [plans, setPlans] = useState<Array<ShortPlanModel>>([]);
  const [planDurations, setPlanDurations] = useState<
    Array<ShortPlanDurationModel>
  >([]);
  const [filters, setFilters] = useState({
    planId: '',
    planDurationId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} planPriceId - id of selected plan price to delete
   * @param {string} planPrice - price of selected plan price to confirm
   * @returns {void}
   */
  const handleOpenDialog = (planPriceId: number, planPrice: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {planPrice}</b>,
      description: <>Are you sure you want to delete this plan price?</>,
      planPriceId
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
   * function to delete the plan price with backend action
   *
   * @param {number} planPriceId - id of selected plan price to delete
   * @returns {void}
   */
  const handleDeletePlanPrice = async (planPriceId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deletePlanPriceRequest(planPriceId);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.roleDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', planPriceId));
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
   * function to get all the planPrice with backend action
   *
   * @returns {void}
   */
  const handleGetPlanPrices = async (): Promise<void> => {
    try {
      const response = await getPlanPricesRequest();
      if (response?.status.response_code === 200) {
        setRows(response.plan_prices || []);
        setOriginalData(response.plan_prices || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
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
   * function to get all the plan duration with backend action
   *
   * @returns {void}
   */
  const handleGetPlanDurations = async (): Promise<void> => {
    try {
      const response = await getPlanDurationsRequest();
      if (response?.status.response_code === 200) {
        setPlanDurations(response.plan_durations || []);
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

    if (filters.planId) {
      updatedRows = updatedRows.filter(
        (item) => String(item.plan.id) === String(filters.planId)
      );
    }

    if (filters.planDurationId) {
      updatedRows = updatedRows.filter(
        (item) =>
          String(item.plan_duration.id) === String(filters.planDurationId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.price.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
          -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'plan_name',
      headerName: 'Plan Name',
      sortable: true,
      flex: 1,
      renderCell: (params: PlanPriceModel) => (
        <Typography>{params.plan.name}</Typography>
      )
    },
    {
      field: 'plan_duration',
      headerName: 'Plan Duration',
      sortable: true,
      width: 200,
      renderCell: (params: PlanPriceModel) => (
        <Typography>{params.plan_duration.no_of_month}</Typography>
      )
    },
    {
      field: 'price',
      headerName: 'Plan Price',
      sortable: true,
      width: 200
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: PlanPriceModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editPlanPricePath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handleOpenDialog(params.id, params.price)}
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
    handleGetPlanPrices();
    handleGetPlans();
    handleGetPlanDurations();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plan Prices">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={3} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addPlanPricePath)}
          >
            Add Plan Price
          </Button>
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
            select
            fullWidth
            label="Select Plan Duration"
            size="small"
            value={filters.planDurationId}
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e: any) => {
              setFilters({ ...filters, planDurationId: e.target.value });
            }}
          >
            <option key="-1" value="">
              - None -
            </option>
            {planDurations.map((option: ShortPlanDurationModel) => (
              <option key={option.id} value={option.id}>
                {option.no_of_month}
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
        onAgreeAction={() => handleDeletePlanPrice(deleteDialog.planPriceId)}
        onDisAgreeAction={handleCloseDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManagePlanPrice;
