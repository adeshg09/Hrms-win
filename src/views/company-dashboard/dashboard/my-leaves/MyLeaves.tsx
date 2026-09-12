/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Apply Leave  Page to apply the Leaves.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 20/Jan/2024
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------
/* Imports */
import { useContext, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
/* Relative Imports */
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  // CardContent,
  Checkbox,
  // Chip,
  Grid,
  IconButton,
  // InputLabel,
  MenuItem,
  // Select,
  TextField
} from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import DataTable from 'components/DataTable';
/* Local Imports */
import { AdminDashboardPage } from 'components/Page';

import { ConfirmDialog, FormDialog } from 'components/Dialog';

import {
  AutoCompleteInput,
  CustomField,
  TextInput
} from 'components/InputFields';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import UploadSingleFile from 'components/InputFields/upload/UploadSingleFile';
import { fetchLeaveTypes } from 'services/company/leaveType';
import { LeaveType } from 'models/company/LeaveType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import {
  AppliedLeaveData,
  ApplyLeaveDataType,
  ApplyLeavePayload
} from 'models/company/ApplyLeave';
import {
  applyLeaveRequest,
  editLeaveRequest,
  // getAllLeaveRequest,
  getAllLeavesById,
  updateLeaveRequest
} from 'services/company/leaveRequest';
// import { fileToBase64 } from 'utility/fileToBase64';
import dayjs from 'dayjs';
import adminStyle from '../../company.style';

/* constants */
const initialStateDeleteDailog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you wnat to delete this Leave Type?</>,
  leaveId: 0
};
/**
 * Component to create the Leave Request  with Edit/Delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */

const MyLeaves = (): JSX.Element => {
  /* Hooks */
  const formikRef = useRef<FormikProps<typeof initialValues> | null>(null);
  const { showSnackbar } = useSnackbarClose();
  const { user } = useContext(SessionContext);
  /* States */
  const [rows, setRows] = useState<AppliedLeaveData[]>([]);
  const [originalData, setOriginalData] = useState<AppliedLeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFormDailog, setOpenFormDailog] = useState(false);
  const [initialValues, setInitialValues] = useState<ApplyLeavePayload>({
    id: null,
    leaveTypeId: null,
    fromDate: '',
    toDate: '',
    reason: '',
    noOfDays: null,
    document: '',
    status: ''
  });
  const [leavesTypes, setLeavesTypes] = useState<LeaveType[]>([]);
  const [deletedailog, setDeleteDialog] = useState(initialStateDeleteDailog);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate the maximum date (1 month before today)
  const maxDate = dayjs().subtract(1, 'month');

  /* Function to Edit applied Leave
   * @params {AppliedLeaveId} : id of the Applied Leave
   * @return {void}
   */
  const handleEditLeave = (appliedLeaveId: number): void => {
    try {
      const rowData = rows.find((row) => row.id === appliedLeaveId);
      if (rowData) {
        const fromDate = new Date(rowData.from_date);
        const toDate = new Date(rowData.to_date);
        const diffInDays =
          Math.floor(
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        setOpenFormDailog(true);
        setInitialValues({
          id: rowData.id,
          leaveTypeId: rowData.leave_type_id,
          fromDate: rowData.from_date,
          toDate: rowData.to_date,
          reason: rowData.reason,
          noOfDays: diffInDays,
          document: rowData.document,
          status: rowData.status
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Funnction to get applied leaves of the user
   * @params {}
   * @returns {}
   */
  const getAppliedLeaves = async (): Promise<void> => {
    try {
      const response = await getAllLeavesById(user.id);
      if (response.status.response_code === 200) {
        setRows(response.leaveRequests);
        setOriginalData(response.leaveRequests);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  /* Fucntion to get leave Types */
  const fetchLeaveType = async (): Promise<void> => {
    try {
      // const response: any = await new Promise((resolve) => {
      //   setTimeout(() => resolve(LeaveData), 1000);
      // });
      const response: any = await fetchLeaveTypes();
      if (response.status.response_code === 200) {
        setLeavesTypes(response.leaveTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('eror fetching leave types', error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };
  /* Function to handle Add Leave */
  const handleAddleave = (): void => {
    setInitialValues({
      id: null,
      leaveTypeId: null,
      fromDate: '',
      toDate: '',
      reason: '',
      noOfDays: null,
      document: ''
    });
    setOpenFormDailog(true);
  };

  /* Funnction to submit form of the Apllied leaves
   * @params {vales}: values of the form of type AppliedLeavType
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: ApplyLeavePayload
    // { resetForm }: any
  ): Promise<void> => {
    try {
      setIsSubmitting(true);
      // const documentBase64 =
      //   values.document instanceof File
      //     ? await fileToBase64(values.document)
      //     : null;
      const reqData: ApplyLeavePayload = {
        leaveTypeId: values.leaveTypeId,
        fromDate: values.fromDate,
        toDate: values.toDate,
        reason: values.reason,
        document: values.document
      };
      // if (documentBase64) {
      //   reqData.document = {
      //     filename: values.document.name,
      //     content: documentBase64
      //   };
      // }
      reqData.userId = user.id;
      reqData.createdBy = user.id;
      console.log('values is', values);
      if (!values.id) {
        const response = await applyLeaveRequest(reqData);
        if (response.status.response_code === 200) {
          await getAppliedLeaves();
          showSnackbar(
            toastMessages.success.adminDashboard.leaveAppliedSaved,
            'success'
          );
        } else if (response.status.response_code === 400) {
          showSnackbar(response.error || toastMessages.error.common, 'error');
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        const response = await editLeaveRequest(values.id, reqData);
        if (response.status.response_code === 200) {
          await getAppliedLeaves();
          showSnackbar(
            toastMessages.success.adminDashboard.leaveAppliedUpdated,
            'success'
          );
        } else if (response.status.response_code === 400) {
          showSnackbar(response.error || toastMessages.error.common, 'error');
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setOpenFormDailog(false);
    setIsSubmitting(false);
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
   * function to open the delete dialog box
   *
   * @param {number} documentTypeId - id of selected designation to delete
   * @param {string} documentTypeName - name of selected designation to confirm
   * @returns {void}
   */
  const handelOpendailog = (leaveId: number): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delete Leave </b>,
      description: <>Are you sure you want to delete this Leave ?</>,
      leaveId
    });
  };
  /* Function to Delete leave Type
   * @params {leaveTypeId}: id for deleting the leave type
   * @return {void}
   */
  const handelDeleteLeave = async (leaveId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      setIsSubmitting(true);
      const reqData: any = {
        status: 'canceled',
        modifiedBy: user.id
      };
      const response = await updateLeaveRequest(leaveId, reqData);
      if (response.status.response_code === 200) {
        setRows((initial) => initial.filter((row) => row.id !== leaveId));
        showSnackbar(
          toastMessages.success.adminDashboard.leaveAppliedDeleted,
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      showSnackbar(
        toastMessages.success.adminDashboard.leaveAppliedDeleted,
        'error'
      );
    }
    setDialogSubmitting(false);
    setIsSubmitting(false);
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
          item.leaveType.name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };
  /* Columns */
  const columns = [
    {
      field: 'leaveType.name',
      headerName: 'Type of Leave',
      sortable: true,
      flex: 1,
      getValue: (params: AppliedLeaveData) => `${params.leaveType.name}`
    },
    {
      field: 'from_date',
      headerName: 'From Date',
      sortable: true,
      flex: 1
    },
    {
      field: 'to_date',
      headerName: 'Till Date',
      sortable: true,
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      flex: 1,
      getValue: (params: AppliedLeaveData) => {
        const { status } = params;
        switch (status?.toLowerCase()) {
          case 'rejected':
            return 'Rejected';
          case 'canceled':
            return 'Cancelled'; // Changed from American to British spelling
          case 'approved':
            return 'Approved';
          case 'pending':
            return 'Pending';
          case 'submitted':
            return 'Submitted';
          default:
            return status
              ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              : '';
        }
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: ApplyLeaveDataType) => (
        <Box sx={adminStyle.actionItems}>
          {params.status === 'pending' && (
            <IconButton
              size="small"
              color="primary"
              aria-label="edit"
              onClick={() => {
                if (params.id) {
                  handleEditLeave(params.id);
                }
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          {params.status === 'pending' && (
            <IconButton
              size="small"
              color="error"
              aria-label="delete"
              onClick={() => {
                if (params.id) {
                  handelOpendailog(params.id);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

  /* Validation schema */
  const validationSchema = Yup.object().shape({
    leaveTypeId: Yup.number().required('Please Select Leave Type'),
    fromDate: Yup.date().required('Please Enter Leave Start Date'),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'), 'To date must be after from date.')
      .required('Please Enter Leave End Date'),
    // .matches(/^^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed'),
    // noOfDays: Yup.number().required(),
    reason: Yup.string().required('Please Enter reason for leave')
    /*  id: null,
    fromDate: '',
    noOfDays: null,
    status: 'pending',
    type: '',
    reason: '' */
  });
  /* UseEffects */
  useEffect(() => {
    getAppliedLeaves();
    fetchLeaveType();
  }, []);
  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  return (
    <AdminDashboardPage title="My Leaves">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={8} md={9}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddleave()}
          >
            Apply Leave
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            label="Search"
            size="small"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            value={filters.searchText}
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
        title={initialValues.leaveTypeId ? 'Edit Leave ' : 'Add new Leave'}
        description=""
        onSubmitAction={() => formikRef.current?.handleSubmit()}
        onCancelAction={() => setOpenFormDailog(false)}
        open={openFormDailog}
        isSubmitting={isSubmitting}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            handleSubmit,
            errors,
            handleChange,
            handleBlur,
            touched,
            values,
            setFieldValue
          }) => (
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <AutoCompleteInput
                    multiple={false} // Single select dropdown
                    disabled={
                      initialValues.status === 'approved' ||
                      initialValues.status === 'rejected' ||
                      initialValues.status === 'canceled'
                    }
                    label="Type of Leave"
                    name="leaveTypeId"
                    value={values.leaveTypeId} // The selected leave type ID
                    data={
                      leavesTypes?.map(
                        (leaveType: LeaveType) => leaveType.id
                      ) || []
                    } // List of IDs
                    originalData={leavesTypes} // The original leave type objects
                    itemId="id" // The property representing the ID
                    itemName="name" // The property representing the name
                    placeholder="Select type of leave"
                    renderOption={(
                      props: any,
                      option: any,
                      { selected }: any
                    ) => (
                      <MenuItem {...props}>
                        <Checkbox checked={selected} />
                        {leavesTypes?.find(
                          (leaveType: LeaveType) => leaveType.id === option
                        )?.name || ''}
                      </MenuItem>
                    )}
                    onChange={(e: any) => {
                      setFieldValue('leaveTypeId', e); // Set the selected leave type ID
                    }}
                    error={Boolean(touched.leaveTypeId && errors.leaveTypeId)}
                    helperText={String(
                      touched.leaveTypeId && errors.leaveTypeId
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={
                        initialValues.status === 'approved' ||
                        initialValues.status === 'rejected' ||
                        initialValues.status === 'canceled'
                      }
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      value={values.fromDate}
                      onChange={(newValue: any) => {
                        if (!newValue) return;

                        // Create date at noon to avoid timezone issues
                        const fromDate = new Date(newValue.$d);
                        fromDate.setHours(12, 0, 0, 0);

                        setFieldValue('fromDate', fromDate);

                        if (values.toDate) {
                          const toDate = new Date(values.toDate);
                          toDate.setHours(12, 0, 0, 0);

                          const diffInDays =
                            Math.floor(
                              (toDate.getTime() - fromDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) + 1;
                          setFieldValue(
                            'noOfDays',
                            diffInDays >= 0 ? diffInDays : 0
                          );
                        }
                      }}
                      minDate={maxDate}
                      renderInput={(params: any) => (
                        <CustomField
                          name="fromDate"
                          label="From Date"
                          error={Boolean(touched.fromDate && errors.fromDate)}
                          helperText={String(
                            touched.fromDate && errors.fromDate
                          )}
                        >
                          <TextField
                            {...params}
                            fullWidth
                            size="medium"
                            name="fromDate"
                            value={values.fromDate}
                            error={Boolean(touched.fromDate && errors.fromDate)}
                          />
                        </CustomField>
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={
                        initialValues.status === 'approved' ||
                        initialValues.status === 'rejected' ||
                        initialValues.status === 'canceled'
                      }
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      value={values.toDate}
                      onChange={(newValue: any) => {
                        if (!newValue) return;

                        // Create date at noon to avoid timezone issues
                        const toDate = new Date(newValue.$d);
                        toDate.setHours(12, 0, 0, 0);

                        setFieldValue('toDate', toDate);

                        if (values.fromDate) {
                          const fromDate = new Date(values.fromDate);
                          fromDate.setHours(12, 0, 0, 0);

                          const diffInDays =
                            Math.floor(
                              (toDate.getTime() - fromDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) + 1;
                          setFieldValue(
                            'noOfDays',
                            diffInDays >= 0 ? diffInDays : 0
                          );
                        }
                      }}
                      renderInput={(params: any) => (
                        <CustomField
                          name="toDate"
                          label="Till Date"
                          error={Boolean(touched.toDate && errors.toDate)}
                          helperText={String(touched.toDate && errors.toDate)}
                        >
                          <TextField
                            {...params}
                            fullWidth
                            size="medium"
                            name="toDate"
                            value={values.toDate}
                            error={Boolean(touched.toDate && errors.toDate)}
                          />
                        </CustomField>
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <TextInput
                    fullWidth
                    disabled
                    label="Days"
                    value={values.noOfDays}
                    name="noOfDays"
                    inputProps={{ readOnly: true }} // Make this field read-only
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <TextInput
                    fullWidth
                    disabled={
                      initialValues.status === 'approved' ||
                      initialValues.status === 'rejected' ||
                      initialValues.status === 'canceled'
                    }
                    multiline
                    label="Reason"
                    value={values.reason}
                    name="reason"
                    inputProps={{ maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.reason && errors.reason)}
                    helperText={String(touched.reason && errors.reason)}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <CustomField name="document" label="Upload Document">
                    <UploadSingleFile
                      name="document"
                      label="Upload"
                      file={values.document}
                      onFileChange={(val) => {
                        console.log('new file', val);
                        setFieldValue('document', val);
                      }}
                      showRemoveButton
                    />
                  </CustomField>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </FormDialog>
      <ConfirmDialog
        open={deletedailog.open}
        title={deletedailog.title}
        description={deletedailog.description}
        isSubmitting={dialogSubmitting}
        agreeText="Delete"
        disagreeText="cancel"
        onDisAgreeAction={handlCloseDailog}
        onAgreeAction={() => handelDeleteLeave(deletedailog.leaveId)}
      />
    </AdminDashboardPage>
  );
};

export default MyLeaves;
