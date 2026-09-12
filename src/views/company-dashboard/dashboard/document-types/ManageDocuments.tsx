/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage designation Page to handle the designations.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Dec/2024
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useEffect, useState } from 'react';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import { AdminDashboardPage } from 'components/Page';
import { useNavigate } from 'react-router-dom';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { DocumentModel } from 'models/company/DocumentType';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toastMessages } from 'constants/appConstant';

/* Local Imports */
import { removeItemFromArray } from 'utility/formatArray';
import { ConfirmDialog } from 'components/Dialog';
import DataTable from 'components/DataTable';
import { getDocumentType } from 'services/company/employee/documentTypeDetails';
import { deleteDocumentType } from 'services/company/documentType';
import adminStyle from '../../company.style';

/* constants */
const addDocumentTypepath =
  PAGE_COMPANY_DASHBOARD.manageDocuments.create.relativePath;
const editDocumentTypePath =
  PAGE_COMPANY_DASHBOARD.manageDocuments.edit.relativePath;
const initialStateDeleteDailog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you wnat to delete this Document Type?</>,
  documentTypeId: 0
};

/**
 * Component to create the Document listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageDocuments = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<DocumentModel>>([]);
  const [originalData, setOriginalData] = useState<Array<DocumentModel>>([]);
  const [deletedailog, setDeleteDialog] = useState(initialStateDeleteDailog);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} documentTypeId - id of selected designation to delete
   * @param {string} documentTypeName - name of selected designation to confirm
   * @returns {void}
   */
  const handelOpendailog = (
    documentTypeId: number,
    documentTypeName: string
  ): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delet {documentTypeName} </b>,
      description: <>Are you sure you want to delete this Document Type?</>,
      documentTypeId
    });
  };
  /**
   * function to close delete dailog box
   *
   * @returns {void}
   */
  const handlCloseDailog = (): void => {
    setDeleteDialog(initialStateDeleteDailog);
  };

  /**
   * function to get all the documents type with backend action
   *
   * @returns {void}
   */
  const handleGetDocumentsType = async (): Promise<void> => {
    try {
      const response = await getDocumentType();
      if (response?.status.response_code === 200) {
        setRows(response.documentTypes || []);
        setOriginalData(response.documentTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('get document type error', error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to delete  documents type with backend action
   *
   * @returns {void}
   */
  const handelDeleteDocumentType = async (
    documentTypeId: number
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteDocumentType(documentTypeId);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.documentTypeDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', documentTypeId));
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    handlCloseDailog();
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
      headerName: 'Document Name',
      sortable: true,
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: DocumentModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editDocumentTypePath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handelOpendailog(params.id, params.name)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </>
      )
    }
  ];
  /* Side Effects */
  useEffect(() => {
    handleGetDocumentsType();
  }, []);
  useEffect(() => {
    handleFilterChange();
  }, [filters]);
  return (
    <AdminDashboardPage title="Manage Document Type">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addDocumentTypepath)}
          >
            Add Document Type
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
        open={deletedailog.open}
        title={deletedailog.title}
        description={deletedailog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Delete"
        disagreeText="cancel"
        onDisAgreeAction={handlCloseDailog}
        onAgreeAction={() =>
          handelDeleteDocumentType(deletedailog.documentTypeId)
        }
      />
    </AdminDashboardPage>
  );
};

export default ManageDocuments;
