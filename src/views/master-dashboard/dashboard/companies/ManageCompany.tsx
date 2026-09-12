/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage company Page to handle the companies.
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
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import moment from 'moment';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { ConfirmDialog } from 'components/Dialog';
import MenuPopover from 'components/MenuPopover';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { removeItemFromArray, updateItemFromArray } from 'utility/formatArray';
import { toastMessages } from 'constants/appConstant';
import { apiBaseUrl } from 'config/config';
import { CompanyModel, ShortPlanModel } from 'models/master';
import {
  deleteCompanyRequest,
  getCompaniesRequest,
  updateCompanyStatusRequest
} from 'services/master/company';
import { getPlansRequest } from 'services/master/plan';

/* Local Imports */
import adminStyle from '../../master.style';
// ----------------------------------------------------------------------

/* Constants */
const addCompanyPath = PAGE_ADMIN_DASHBOARD.companies.create.relativePath;
const editCompanyPath = PAGE_ADMIN_DASHBOARD.companies.edit.relativePath;
const initialStateDeleteDialog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you want to delete this company?</>,
  companyId: 0
};
const initialStateStatusDialog = {
  open: false,
  title: <>Update</>,
  description: <>Are you sure you want to update this company's status?</>,
  companyId: 0,
  isActive: 0
};

const initialStateViewPopover = {
  open: false,
  data: null
};

// ----------------------------------------------------------------------

/**
 * Component to create the company listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ManageCompany = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [rows, setRows] = useState<Array<CompanyModel>>([]);
  const [originalData, setOriginalData] = useState<Array<CompanyModel>>([]);
  const [deleteDialog, setDeleteDialog] = useState(initialStateDeleteDialog);
  const [statusDialog, setStatusDialog] = useState(initialStateStatusDialog);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewPopover, setViewPopover] = useState<any>(initialStateViewPopover);
  const [loading, setLoading] = useState(true);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [plans, setPlans] = useState<Array<ShortPlanModel>>([]);
  const [filters, setFilters] = useState({
    planId: '',
    searchText: ''
  });

  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} companyId - id of selected company to delete
   * @param {string} companyName - name of selected company to confirm
   * @returns {void}
   */
  const handleOpenDialog = (companyId: number, companyName: string): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete {companyName}</b>,
      description: <>Are you sure you want to delete this company?</>,
      companyId
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
   * @param {number} companyId - id of selected company to update status
   * @param {string} companyName - name of selected company to confirm
   * @param {boolean|null|undefined} isActive - active status of selected company to update
   * @returns {void}
   */
  const handleOpenStatusDialog = (
    companyId: number,
    companyName: string,
    isActive: boolean | null | undefined
  ): void => {
    const popuptext = `${
      isActive === true
        ? 'Are you sure you want to deactivate this company'
        : 'Are you sure you want to activate this company'
    }`;
    const popupdesc = (
      <>
        {popuptext} - <b>"{companyName}"</b>?
      </>
    );
    setStatusDialog({
      open: true,
      title:
        isActive === true ? <>Deactivate Company</> : <>Activate Company</>,
      description: popupdesc,
      companyId,
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
   * function to delete the company with backend action
   *
   * @param {number} companyId - id of selected company to delete
   * @returns {void}
   */
  const handleDeleteCompany = async (companyId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const response = await deleteCompanyRequest(companyId, user.id);
      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.companyDeleted,
          'success'
        );
        setRows(removeItemFromArray(rows, 'id', companyId));
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
   * function to open the view popover
   *
   * @param {object} event - event of selected lead to view
   * @param {object} data - data of selected lead to view
   * @returns {void}
   */
  const handleOpenPopover = (event: any, data: any): void => {
    setAnchorEl(event.currentTarget);
    setViewPopover({
      open: true,
      data
    });
  };

  /**
   * function to close the view popover
   *
   * @returns {void}
   */
  const handleClosePopover = (): void => {
    setAnchorEl(null);
    setViewPopover(initialStateViewPopover);
  };

  /**
   * function to get all the companies with backend action
   *
   * @returns {void}
   */
  const handleGetCompanies = async (): Promise<void> => {
    try {
      const response = await getCompaniesRequest();
      console.log('companies are', response);
      if (response?.status.response_code === 200) {
        setRows(response.companies || []);
        setOriginalData(response.companies || []);
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
    setLoading(true);
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
    setLoading(false);
  };

  /**
   * function to update active state
   *
   * @param {number} companyId - id of the current company.
   * @param {any} isCompanyActive - status of the current company.
   * @returns {void}
   */
  const handleUpdateActiveCompany = async (
    companyId: number,
    isCompanyActive: any
  ): Promise<void> => {
    setDialogSubmitting(true);
    try {
      const requestData: any = {
        isActive: isCompanyActive,
        modifiedBy: user.id
      };
      const response = await updateCompanyStatusRequest(companyId, requestData);
      if (response && response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.companyStatusUpdated,
          'success'
        );
        setRows(
          updateItemFromArray(
            rows,
            'id',
            companyId,
            'is_active',
            !!isCompanyActive
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

    if (filters.planId) {
      updatedRows = updatedRows.filter(
        (item) => String(item.plan?.id) === String(filters.planId)
      );
    }

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.name.toLowerCase().indexOf(filters.searchText.toLowerCase()) >
            -1 ||
          item.display_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.address || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.city || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.state || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.country || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.pin_code || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.registered_email
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          item.domain_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.user_count || '')
            .toString()
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.start_date || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1 ||
          (item.end_date || '')
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };

  const viewItem = (title: any, value: any): JSX.Element => (
    <Grid container spacing={2}>
      <Grid item md={4} sm={4} xs={12}>
        <Typography variant="h6" pr={2} sx={adminStyle.viewItemTitle}>
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={12}>
        <Typography variant="body1" sx={adminStyle.viewItemBody}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );

  /* Columns */
  const columns = [
    {
      field: 'name',
      headerName: 'Company Name',
      sortable: true,
      flex: 1
    },
    {
      field: 'domain_name',
      headerName: 'Domain Name',
      sortable: true,
      width: 160
    },
    {
      field: 'registered_email',
      headerName: 'Email',
      sortable: true,
      width: 230
    },
    {
      field: 'plan',
      headerName: 'Plan',
      sortable: true,
      width: 130,
      renderCell: (params: CompanyModel) => params.plan?.name
    },
    {
      field: 'user_count',
      headerName: 'No of Users',
      sortable: true,
      width: 140
    },
    {
      field: 'isActive',
      headerName: 'Status',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params: CompanyModel) => (
        <FormControlLabel
          control={
            <Switch
              checked={!!params.is_active}
              onChange={() => {
                handleOpenStatusDialog(
                  params.id,
                  params.name,
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
      renderCell: (params: CompanyModel) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="default"
                aria-label="view"
                onClick={(e) => handleOpenPopover(e, params)}
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() =>
                  navigate(editCompanyPath.replace(':id', `${params.id}`))
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
    handleGetCompanies();
    handleGetPlans();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Output */
  return (
    <AdminDashboardPage title="Manage Companies">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={5} md={6}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(addCompanyPath)}
          >
            Add Company
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
        onAgreeAction={() => handleDeleteCompany(deleteDialog.companyId)}
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
          handleUpdateActiveCompany(
            statusDialog.companyId,
            statusDialog.isActive
          )
        }
        onDisAgreeAction={handleCloseStatusDialog}
      />
      <MenuPopover
        id="view"
        open={viewPopover.open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        contentStyle={adminStyle.viewPopover}
      >
        {viewPopover.data && (
          <Box sx={adminStyle.popoverView}>
            <Box sx={adminStyle.closePopover}>
              <IconButton onClick={handleClosePopover} sx={adminStyle.mbottom}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={3} sx={adminStyle.popoverMainBox}>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Name', viewPopover.data.name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Domain Name', viewPopover.data.domain_name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Display Name', viewPopover.data.display_name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Registered Email',
                  viewPopover.data.registered_email
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('User Count', viewPopover.data.user_count)}
              </Grid>
              {viewPopover.data.plan_id?.name && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem('Plan', viewPopover.data.plan_id.name)}
                </Grid>
              )}
              {viewPopover.data.address && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem('Address', viewPopover.data.address)}
                </Grid>
              )}
              {viewPopover.data.city && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem('City', viewPopover.data.city)}
                </Grid>
              )}
              {viewPopover.data.state && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem('State', viewPopover.data.state)}
                </Grid>
              )}
              {viewPopover.data.country && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem('Country', viewPopover.data.country)}
                </Grid>
              )}
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Pincode', viewPopover.data.pin_code)}
              </Grid>
              {viewPopover.data.start_date && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem(
                    'Start Date',
                    moment(viewPopover.data.start_date).format('yyyy-MM-DD')
                  )}
                </Grid>
              )}
              {viewPopover.data.end_date && (
                <Grid item md={12} sm={12} xs={12}>
                  {viewItem(
                    'End Date',
                    moment(viewPopover.data.end_date).format('yyyy-MM-DD')
                  )}
                </Grid>
              )}
              <Grid item md={12} sm={12} xs={12}>
                {viewPopover.data.is_active ? (
                  <>{viewItem('Active Status', 'yes')}</>
                ) : (
                  <>{viewItem('Active Status', 'no')}</>
                )}
              </Grid>
              {viewPopover.data.logo && (
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={4} xs={12}>
                      <Typography
                        variant="h6"
                        pr={2}
                        sx={adminStyle.viewItemTitle}
                      >
                        Company Logo :
                      </Typography>
                    </Grid>
                    <Grid item md={8} sm={8} xs={12}>
                      <Box
                        component="img"
                        src={`${apiBaseUrl}/${viewPopover.data.logo}`}
                        alt=""
                        maxHeight="200px"
                        maxWidth="200px"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </MenuPopover>
    </AdminDashboardPage>
  );
};

export default ManageCompany;
