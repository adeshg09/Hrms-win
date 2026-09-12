/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage client page to handle the client.
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
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
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
import { ClientModel } from 'models/company';
import {
  deleteClientRequest,
  getClientsRequest
} from 'services/company/client';

/* Local Imports */
import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* Constants */
const addClientPath = PAGE_COMPANY_DASHBOARD.clients.create.relativePath;
const editClientPath = PAGE_COMPANY_DASHBOARD.clients.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this client?</>,
  clientId: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the client listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageClient = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<ClientModel>>([]);
  const [originalData, setOriginalData] = useState<Array<ClientModel>>([]);
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
   * @param {number} clientId - id of selected client to delete
   * @param {string} clientName - name of selected client to confirm
   * @returns {void}
   */
  const handleOpenDialog = (clientId: number, clientName: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {clientName}</b>,
      description: <>Are you sure you want to delete this client?</>,
      clientId
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
   * function to delete the client with backend action
   *
   * @param {number} clientId - id of selected client to delete
   * @returns {void}
   */
  const handleDeleteClient = async (clientId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteClientRequest(clientId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.clientDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', clientId));
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
   * function to get all the clients with backend action
   *
   * @returns {void}
   */
  const handleGetClients = async (): Promise<void> => {
    try {
      const response = await getClientsRequest();
      if (response?.status.response_code === 200) {
        setRows(response.clients || []);
        setOriginalData(response.clients || []);
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
          (item.company_name || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.country || '')
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
      headerName: 'Client Name',
      sortable: true,
      flex: 1
    },
    {
      field: 'country',
      headerName: 'Country',
      sortable: true,
      width: 250
    },
    {
      field: 'company_name',
      headerName: 'Company Name',
      sortable: true,
      width: 250,
      renderCell: (params: ClientModel) => params.company_name || '-'
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 150,
      renderCell: (params: ClientModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editClientPath.replace(':id', `${params.id}`))
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
    handleGetClients();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Clients">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addClientPath)}
          >
            Add Client
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
        onAgreeAction={() => handleDeleteClient(deleteDialog.clientId)}
        onDisAgreeAction={handleCloseDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageClient;
