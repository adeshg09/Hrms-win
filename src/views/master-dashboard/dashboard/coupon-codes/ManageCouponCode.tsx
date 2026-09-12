/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage coupon code Page to handle the coupon codes.
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
  Switch,
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
import { removeItemFromArray, updateItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import {
  deleteCouponCodeRequest,
  getCouponCodesRequest,
  updateCouponCodeStatusRequest
} from 'services/master/couponCode';
import { CouponCodeModel } from 'models/master';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const addCouponCodePath = PAGE_ADMIN_DASHBOARD.couponCodes.create.relativePath;
const editCouponCodePath = PAGE_ADMIN_DASHBOARD.couponCodes.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this coupon code?</>,
  couponCodeId: 0
};
const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this coupon code's status?</>,
  couponCodeId: 0,
  isActive: 0
};

// ----------------------------------------------------------------------

/**
 * Component to create the coupon code listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageCouponCode = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<CouponCodeModel>>([]);
  const [originalData, setOriginalData] = useState<Array<CouponCodeModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} couponCodeId - id of selected coupon code to delete
   * @param {string} code - code of selected coupon code to confirm
   * @returns {void}
   */
  const handleOpenDialog = (couponCodeId: number, code: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {code}</b>,
      description: <>Are you sure you want to delete this coupon code?</>,
      couponCodeId
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
   * @param {number} couponCodeId - id of selected coupon code to update status
   * @param {string} code - name of selected coupon code to confirm
   * @param {boolean|null|undefined} isActive - active status of selected coupon code to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    couponCodeId: number,
    code: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this coupon code'
        : 'Are you sure you want to activate this coupon code'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{code}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title:
        isActive === true ? (
          <>Deactivate Coupon Code</>
        ) : (
          <>Activate Coupon Code</>
        ),
      description: popupdesc,
      couponCodeId,
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
   * function to delete the coupon code with backend action
   *
   * @param {number} couponCodeId - id of selected coupon code to delete
   * @returns {void}
   */
  const handleDeleteCouponCode = async (
    couponCodeId: number
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteCouponCodeRequest(couponCodeId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.couponCodeDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', couponCodeId));
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
   * function to get all the coupon codes with backend action
   *
   * @returns {void}
   */
  const handleGetCouponCodes = async (): Promise<void> => {
    try {
      const response = await getCouponCodesRequest();
      if (response?.status.response_code === 200) {
        setRows(response.coupon_codes || []);
        setOriginalData(response.coupon_codes || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to update active state
   *
   * @param {number} couponCodeId - id of the current coupon code.
   * @param {any} isCouponCodeActive - status of the current coupon code.
   * @returns {void}
   */
  const handleUpdateActiveCouponCode = async (
    couponCodeId: number,
    isCouponCodeActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isCouponCodeActive,
        modifiedBy: user.id
      };
      const response = await updateCouponCodeStatusRequest(
        couponCodeId,
        requestData
      );
      if (response && response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.couponCodeStatusUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(
            rows,
            'id',
            couponCodeId,
            'is_active',
            !!isCouponCodeActive
          )
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

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.code.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          item.discount
            .toString()
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.summary || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.description || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  /* Columns */
  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      sortable: true,
      width: 150
    },
    {
      field: 'discount',
      headerName: 'Discount',
      sortable: true,
      width: 120,
      renderCell: (params: any) =>
        `${params.discount} ${params.is_percentage ? '%' : 'RS'}`
    },
    {
      field: 'max_discount',
      headerName: 'Max Discount',
      sortable: true,
      width: 180,
      renderCell: (params: any) =>
        params.max_discount ? `${params.max_discount} RS` : '-'
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
      field: 'isActive',
      headerName: 'Status',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: CouponCodeModel) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!params.is_active}
              onChange={() => {
                handleOpenStatusDialog(
                  params.id,
                  params.code,
                  params.is_active
                );
              }}
            />
          }
          label=""
        />
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: CouponCodeModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editCouponCodePath.replace(':id', `${params.id}`))
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handleOpenDialog(params.id, params.code)}
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
    handleGetCouponCodes();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Coupon Codes">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addCouponCodePath)}
          >
            Add Coupon Code
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
        onAgreeAction={() => handleDeleteCouponCode(deleteDialog.couponCodeId)}
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
          handleUpdateActiveCouponCode(
            statusDialog.couponCodeId,
            statusDialog.isActive
          )
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
    </AdminDashboardPage>
  );
};

export default ManageCouponCode;
