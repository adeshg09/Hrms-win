/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage EntitleMents Type  Page to handle the entitlements.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 22/Jan/2025
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import * as Yup from 'yup';
/* Relative Imports */
import {
  Button,
  CardContent,
  Checkbox,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';
import { AdminDashboardPage } from 'components/Page';

import {
  Add as AddIcon,
  // Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  EntitlementPayload,
  EntitlementRecord
} from 'models/company/Entitlements';
import {
  addEntitlementLeaves,
  deleteEntitlements,
  getAllEntitlements
} from 'services/company/entitlements';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import DataTable from 'components/DataTable';
import { Form, Formik, FormikProps } from 'formik';

/* Local Imports */
import { LeaveType } from 'models/company/LeaveType';
import { fetchLeaveTypes } from 'services/company/leaveType';
import { AutoCompleteInput } from 'components/InputFields';
import { getUsersRequest } from 'services/company/user';
import { ConfirmDialog, FormDialog } from 'components/Dialog';
import SessionContext from 'context/SessionContext';
import { getDate } from 'utility/formatDate';
import { UserProfileModel } from 'models/company';
/* constants */
const initialStateDeleteDailog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you wnat to delete this Entitlement ?</>,
  entitlementId: 0
};
/**
Component to Entitlements
* @component
*@returns {JSX.Element}
* */
const ManageEntitlements = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const formikRef = useRef<FormikProps<typeof initialValues> | null>(null);
  const { user } = useContext(SessionContext);
  /* States */
  const [loading, setLoading] = useState(true);
  const [deletedailog, setDeleteDialog] = useState(initialStateDeleteDailog);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [rows, setRows] = useState<EntitlementRecord[]>([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<LeaveType[]>([]);
  const [users, setUsers] = useState<UserProfileModel[]>([]);
  const [openFormDailog, setOpenFormDailog] = useState(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });
  const [originalData, setOriginalData] = useState<EntitlementRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<EntitlementPayload>({
    nameSelection: null,
    leaveTypeId: null,
    startDate: user.company.start_period
      ? user.company.start_period.split('T')[0]
      : `${new Date().getFullYear()}-01-01`,
    endDate: (() => {
      const startDate = user.company.start_period
        ? new Date(user.company.start_period.split('T')[0])
        : new Date(`${new Date().getFullYear()}-01-01`);
      const endDate = new Date(
        startDate.getFullYear() + 1,
        startDate.getMonth(),
        startDate.getDate()
      );
      return endDate.toISOString().split('T')[0];
    })(),
    totalEntitledLeaves: null
  });
  const [selectedStartDate, setSelectedStartDate] = useState(
    initialValues.startDate
  );

  const calculateSecondDate = (initialDate: string): any => {
    const start = new Date(initialDate);
    const secondDate = new Date(
      start.getFullYear() + 1,
      start.getMonth(),
      start.getDate()
    );
    return secondDate.toISOString().split('T')[0];
  };
  const calculateSecondDateDropdown = (initialDate: string): string => {
    const [year, month, day] = initialDate.split('-').map(Number);
    const secondYear = year + 1;
    return `${secondYear}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  };
  // Generate dropdown options
  const dateOptions = [
    {
      value: initialValues.startDate,
      // label: `${new Date(initialValues.startDate).toLocaleDateString()}`
      label: getDate(initialValues.startDate, 'dd / MM / yy')
    },
    {
      value: calculateSecondDateDropdown(initialValues.startDate),

      // label: `${new Date(
      //   calculateSecondDate(initialValues.startDate)
      // ).toLocaleDateString()}`
      label: getDate(
        calculateSecondDateDropdown(initialValues.startDate),
        'dd / MM / yy'
      )
    }
  ];

  /* function to fetch data from api and store in state
   * @return {void}
   */
  const fetchLeaveType = async (): Promise<void> => {
    try {
      // const response: any = await new Promise((resolve) => {
      //   setTimeout(() => resolve(LeaveData), 1000);
      // });
      const response: any = await fetchLeaveTypes();
      if (response.status.response_code === 200) {
        setLeaveTypeOptions(response.leaveTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('eror fetching leave types', error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to open the delete dialog box
   *
   * @param {number} documentTypeId - id of selected designation to delete
   * @param {string} documentTypeName - name of selected designation to confirm
   * @returns {void}
   */
  const handelOpendailog = (entitlementId: number): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delet Entitlement </b>,
      description: <>Are you sure you want to delete this entitlement?</>,
      entitlementId
    });
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
          item.user.first_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };
  /**
   * function to get all the employees with backend action
   *
   * @returns {void}
   */
  const handleGetEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUsersRequest();
      console.log('users are', response);
      if (response?.status.response_code === 200) {
        setUsers(response.users);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /* Functions */
  const getAllLeaveEntitlements = async (): Promise<void> => {
    try {
      const response = await getAllEntitlements();
      if (response.status.response_code === 200) {
        setRows(response.employeeLeaves);
        setOriginalData(response.employeeLeaves);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /* Function to Delete Entitlement
   * @params {leaveTypeId}: id for deleting the leave type
   * @return {void}
   */
  const handelDeleteEntitlement = async (
    entitlementId: number
  ): Promise<void> => {
    setDialogSubmitting(true);
    setIsSubmitting(true);
    try {
      // do the api call to delete leave type
      const response = await deleteEntitlements(entitlementId);
      if (response.status.response_code === 200) {
        setRows((initial) => initial.filter((row) => row.id !== entitlementId));
        showSnackbar(
          toastMessages.success.adminDashboard.entitlementDeleted,
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    setIsSubmitting(false);
    setDeleteDialog(initialStateDeleteDailog);
  };
  /* Function to handle Form submit */
  const handleFormSubmit = async (
    values: EntitlementPayload
  ): Promise<void> => {
    setIsSubmitting(true);
    try {
      const requestData: any = {
        leaveTypeId: values.leaveTypeId,
        startDate: values.startDate,
        endDate: values.endDate,
        totalEntitledLeaves: values.totalEntitledLeaves,
        userId: values.nameSelection
      };
      requestData.createdBy = user.id;
      const response = await addEntitlementLeaves(requestData);
      setOpenFormDailog(false);
      if (response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.entitlementSaved,
          'success'
        );
        await getAllLeaveEntitlements();
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setIsSubmitting(false);
  };
  /* columns */
  const columns = [
    {
      field: 'user.first_name',
      headerName: 'First Name',
      sortable: true,
      width: 160,
      getValue: (params: EntitlementRecord) => `${params.user.first_name}`
    },
    {
      field: 'leaveType.name',
      headerName: 'Leave Type',
      sortable: true,
      width: 180,
      getValue: (params: EntitlementRecord) => `${params.leaveType.name}`
    },
    {
      field: 'total_entitled_leaves',
      headerName: 'Total Entitlements',
      sortable: true,
      width: 180
    },
    {
      field: 'leave_balance',
      headerName: 'Balance',
      sortable: true,
      width: 140
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: EntitlementRecord) => (
        <Button
          color="error"
          onClick={() => {
            if (params.id) {
              handelOpendailog(params.id);
            }
          }}
        >
          <DeleteIcon />
        </Button>
      )
    }
  ];

  /* UseEffects */
  useEffect(() => {
    getAllLeaveEntitlements();
    handleGetEmployees();
    fetchLeaveType();
  }, []);
  useEffect(() => {
    handleFilterChange();
  }, [filters]);
  /* Validation schema */
  const validationSchema = Yup.object().shape({
    nameSelection: Yup.number().required('Please Select Employee'),
    leaveTypeId: Yup.number().required('Please Select Leave Type'),
    totalEntitledLeaves: Yup.string().required('Please Enter Entilements')
    // fromDate: Yup.date().required('Please Enter Leave Start Date'),
    // toDate: Yup.date().required('Please Enter Leave End Date'),
    // .matches(/^^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed'),
    // noOfDays: Yup.number().required(),
    /*  id: null,
    fromDate: '',
    noOfDays: null,
    status: 'pending',
    type: '',
    reason: '' */
  });
  return (
    <AdminDashboardPage title="Manage Entitlements">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenFormDailog(true)}
          >
            Add Entitlements
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
      <FormDialog
        title="Add Entitlements"
        open={openFormDailog}
        onSubmitAction={() => {
          if (formikRef.current) {
            formikRef.current.handleSubmit();
          }
        }}
        onCancelAction={() => setOpenFormDailog(false)}
        isSubmitting={isSubmitting}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue
          }) => {
            const handleDateChange = (event: any): any => {
              const selectedDate = event.target.value;

              // Update both local state and Formik values
              setSelectedStartDate(selectedDate);
              setFieldValue('startDate', selectedDate);

              // Calculate and set end date
              const endDate = calculateSecondDate(selectedDate);
              setFieldValue('endDate', endDate);
            };
            return (
              <Form>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Multiselect Dropdown */}
                    <Grid item xs={12} sm={6} md={6}>
                      <AutoCompleteInput
                        label="Select Name"
                        name="nameSelection"
                        value={values.nameSelection}
                        data={users?.map((option) => option.id) || []}
                        originalData={users}
                        itemId="id"
                        itemName="first_name"
                        placeholder="Search User"
                        onChange={(e: any) => {
                          setFieldValue('nameSelection', e);
                        }}
                        error={Boolean(
                          touched.nameSelection && errors.nameSelection
                        )}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => {
                          const searchUser = users?.find(
                            (opt) => opt.id === option
                          );
                          return (
                            <MenuItem {...props}>
                              <Checkbox checked={selected} />
                              {searchUser
                                ? `${searchUser.first_name} ${searchUser.last_name}`
                                : ''}
                            </MenuItem>
                          );
                        }}
                      />
                    </Grid>

                    {/* Dropdown for Leave Type */}
                    <Grid item xs={12} sm={6} md={6}>
                      <AutoCompleteInput
                        label="Leave Type"
                        name="leaveTypeId"
                        value={values.leaveTypeId}
                        data={
                          leaveTypeOptions?.map((option) => option.id) || []
                        }
                        originalData={leaveTypeOptions}
                        itemId="id"
                        itemName="name"
                        placeholder="Search leave type"
                        onChange={(e: any) => {
                          setFieldValue('leaveTypeId', e);
                        }}
                        error={Boolean(
                          touched.leaveTypeId && errors.leaveTypeId
                        )}
                        // helperText={touched.leaveTypeId && errors.leaveTypeId}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {leaveTypeOptions?.find((opt) => opt.id === option)
                              ?.name || ''}
                          </MenuItem>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        value={selectedStartDate}
                        onChange={handleDateChange}
                        variant="outlined"
                        error={Boolean(touched.startDate && errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                      >
                        {dateOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={values.endDate}
                        InputProps={{
                          readOnly: true // Make this field non-editable
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    {/* Number Field for Days */}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Entitlements"
                        name="totalEntitledLeaves"
                        value={values.totalEntitledLeaves}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.totalEntitledLeaves &&
                            errors.totalEntitledLeaves
                        )}
                        helperText={
                          touched.totalEntitledLeaves &&
                          errors.totalEntitledLeaves
                        }
                        inputProps={{ min: 1, max: 365 }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Form>
            );
          }}
        </Formik>
      </FormDialog>
      <ConfirmDialog
        open={deletedailog.open}
        title={deletedailog.title}
        description={deletedailog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Delete"
        disagreeText="cancel"
        onDisAgreeAction={() => setDeleteDialog(initialStateDeleteDailog)}
        onAgreeAction={() =>
          handelDeleteEntitlement(deletedailog.entitlementId)
        }
      />
    </AdminDashboardPage>
  );
};

export default ManageEntitlements;
