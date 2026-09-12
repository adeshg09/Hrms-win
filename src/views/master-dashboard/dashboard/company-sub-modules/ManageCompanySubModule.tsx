/* Imports */
import { useContext, useEffect, useState } from 'react';
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
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import {
  deleteCompanySubModuleRequest,
  getCompanySubModulesRequest
} from 'services/master/companySubModule';
import { SubModuleModel } from 'models/master/CompanySubModule';

/* Local Imports */

import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addSubModulePath =
  PAGE_ADMIN_DASHBOARD.companySubModules.create.relativePath;
const editSubModulePath =
  PAGE_ADMIN_DASHBOARD.companySubModules.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this sub module?</>,
  subModuleId: 0
};

/**
 * Component to create the sub module listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageSubModule = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<SubModuleModel>>([]);
  const [originalData, setOriginalData] = useState<Array<SubModuleModel>>([]);
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
   * @param {number} subModuleId - id of selected SubModule to delete
   * @param {string} subModuleName - name of selected SubModule to confirm
   * @returns {void}
   */
  const handleOpenDialog = (
    subModuleId: number,
    subModuleName: string
  ): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {subModuleName}</b>,
      description: <>Are you sure you want to delete this sub module?</>,
      subModuleId
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
   * function to delete the subModule with backend action
   *
   * @param {number} subModuleId - id of selected subModule to delete
   * @returns {void}
   */
  const handleDeleteSubModule = async (subModuleId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteCompanySubModuleRequest(
        subModuleId,
        user.id
      );
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.SubModuleDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', subModuleId));
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
   * function to get all the modules with backend action
   *
   * @returns {void}
   */
  const handleGetSubModules = async (): Promise<void> => {
    try {
      const response = await getCompanySubModulesRequest();
      if (response?.status.response_code === 200) {
        setRows(response.company_sub_modules || []);
        setOriginalData(response.company_sub_modules || []);
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
          item.name.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          (item.display_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.summary || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };
  /* Columns */
  const columns = [
    {
      field: 'name',
      headerName: 'Sub Module Name',
      sortable: true,
      width: 150
    },
    {
      field: 'display_name',
      headerName: 'Display Name',
      sortable: true,
      width: 170
    },
    {
      field: 'summary',
      headerName: 'Summary',
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <Typography sx={adminStyle.ellipsis}>{params.summary}</Typography>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: SubModuleModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editSubModulePath.replace(':id', `${params.id}`))
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
    handleGetSubModules();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Sub Modules">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addSubModulePath)}
          >
            Add Sub Module
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
        onAgreeAction={() => handleDeleteSubModule(deleteDialog.subModuleId)}
        onDisAgreeAction={handleCloseDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageSubModule;
