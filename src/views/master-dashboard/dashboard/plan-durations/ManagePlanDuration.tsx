/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage plan duration page to handle the plan durations.
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
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
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
  deletePlanDurationRequest,
  getPlanDurationsRequest
} from 'services/master/planDuration';
import { PlanDurationModel } from 'models/master';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addPlanDurationPath =
  PAGE_ADMIN_DASHBOARD.planDuration.create.relativePath;
const editPlanDurationPath =
  PAGE_ADMIN_DASHBOARD.planDuration.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this plan duration?</>,
  planDurationId: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the planDuration listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManagePlanDuration = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<PlanDurationModel>>([]);
  const [originalData, setOriginalData] = useState<Array<PlanDurationModel>>(
    []
  );
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
   * @param {number} planDurationId - id of selected planDuration to delete
   * @param {number} planDuration - name of selected planDuration to confirm
   * @returns {void}
   */
  const handleOpenDialog = (
    planDurationId: number,
    planDuration: number
  ): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {planDuration}</b>,
      description: <>Are you sure you want to delete this plan duration?</>,
      planDurationId
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
   * function to delete the planDuration with backend action
   *
   * @param {number} planDurationId - id of selected planDuration to delete
   * @returns {void}
   */
  const handleDeletePlanDuration = async (
    planDurationId: number
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deletePlanDurationRequest(planDurationId);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.planDurationDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', planDurationId));
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
   * function to get all the plan duration with backend action
   *
   * @returns {void}
   */
  const handleGetPlanDurations = async (): Promise<void> => {
    try {
      const response = await getPlanDurationsRequest();
      if (response?.status.response_code === 200) {
        setRows(response.plan_durations || []);
        setOriginalData(response.plan_durations || []);
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
          item.no_of_month
            .toString()
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'no_of_month',
      headerName: 'No of Months',
      sortable: true,
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: PlanDurationModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editPlanDurationPath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handleOpenDialog(params.id, params.no_of_month)}
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
    handleGetPlanDurations();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plan Durations">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addPlanDurationPath)}
          >
            Add Plan Duration
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
        onAgreeAction={() =>
          handleDeletePlanDuration(deleteDialog.planDurationId)
        }
        onDisAgreeAction={handleCloseDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManagePlanDuration;
