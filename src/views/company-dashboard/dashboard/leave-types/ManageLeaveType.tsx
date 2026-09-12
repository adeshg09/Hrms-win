/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage Leave Type  Page to handle the Leave Types.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Jan/2025
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
  // Divider,
  Grid,
  IconButton,
  // MenuItem,
  TextField,
  // Checkbox,
  // Autocomplete,
  Stack
} from '@mui/material';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
/* Local Imports */
import { toastMessages } from 'constants/appConstant';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { ConfirmDialog, FormDialog } from 'components/Dialog';
import { Form, Formik, FormikProps } from 'formik';
import { TextInput } from 'components/InputFields';
import SessionContext from 'context/SessionContext';
import {
  LeaveType,
  LeaveTypeDataType,
  LeaveTypeSubmit
} from 'models/company/LeaveType';
import {
  addLeaveType,
  deleteLeaveType,
  editLeaveType,
  fetchLeaveTypes
} from 'services/company/leaveType';
import { useNavigate } from 'react-router-dom';
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import adminStyle from '../../company.style';

/* constants */
const initialStateDeleteDailog = {
  open: false,
  title: <>Delete</>,
  description: <>Are you sure you wnat to delete this Leave Type?</>,
  leaveTypeId: 0
};
const EntitlementsPage = PAGE_COMPANY_DASHBOARD.entitlements.absolutePath;
/** 
Component to manage Leave types
* @component
*@returns {JSX.Element}
* */
const ManageLeaveType = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const formikRef = useRef<FormikProps<typeof initialValues> | null>(null);
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  /* States */
  const [rows, setRows] = useState<LeaveType[]>([]);
  const [originalData, setOriginalData] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openFormDailog, setOpenFormDailog] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    searchText: ''
  });
  const [initialValues, setInitialValues] = useState<LeaveTypeSubmit>({
    id: null,
    txtLeaveTypeName: '',
    txtLeaveTypeNumber: null
  });
  const [deletedailog, setDeleteDialog] = useState(initialStateDeleteDailog);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setRows(response.leaveTypes);
        setOriginalData(response.leaveTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('eror fetching leave types', error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /* Function to edit Leave
   * @return {void}
   */
  const handleEditLeave = (leaveTypeId: number): void => {
    // setEditFormData(rows.find((leave) => leave.id === leaveTypeId));
    const rowData = rows.find((row) => row.id === leaveTypeId);
    if (rowData) {
      setOpenFormDailog(true);
      setInitialValues({
        id: rowData.id,
        txtLeaveTypeName: rowData.name,
        txtLeaveTypeNumber: rowData.no_of_leaves
      });
    }
  };

  /* fucnction to handle Form Submit */
  const handleFormSubmit = async (
    values: LeaveTypeSubmit
    // { resetForm }: any
  ): Promise<void> => {
    try {
      setIsSubmitting(true);
      const requestData: any = {
        leaveTypeName: values.txtLeaveTypeName.trim(),
        noOfLeaves: values.txtLeaveTypeNumber
      };
      if (!values.id) {
        requestData.createdBy = user.id;
        const response = await addLeaveType(requestData);
        setOpenFormDailog(false);
        if (response.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.leaveTypeSaved,
            'success'
          );
          await fetchLeaveType();
        }
      } else {
        requestData.modifiedBy = user.id;
        const response = await editLeaveType(values.id, requestData);
        setOpenFormDailog(false);
        if (response.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.leaveTypeUpdated,
            'success'
          );
          await fetchLeaveType();
        }
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }

    setLoading(false);
    setIsSubmitting(false);
  };
  /* Functions */
  /**
   * function to open the delete dialog box
   *
   * @param {number} documentTypeId - id of selected designation to delete
   * @param {string} documentTypeName - name of selected designation to confirm
   * @returns {void}
   */
  const handleOpendailog = (
    leaveTypeId: number,
    leaveTypeName: string
  ): void => {
    setDeleteDialog({
      open: true,
      title: <b>Delet {leaveTypeName} </b>,
      description: <>Are you sure you want to delete this Leave Type?</>,
      leaveTypeId
    });
  };

  /* Function to add Leave Type */
  const handleAddLeaveType = (): void => {
    setInitialValues({
      id: null,
      txtLeaveTypeName: '',
      txtLeaveTypeNumber: null
    });
    setOpenFormDailog(true);
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
  /**
   * function to close delete dailog box
   *
   * @returns {void}
   */
  const handlCloseDailog = (): void => {
    setDeleteDialog(initialStateDeleteDailog);
  };
  /* Function to Delete leave Type
   * @params {leaveTypeId}: id for deleting the leave type
   * @return {void}
   */
  const handelDeleteLeave = async (leaveTypeId: number): Promise<void> => {
    setDialogSubmitting(true);
    try {
      setIsSubmitting(true);
      // do the api call to delete leave type
      const response = await deleteLeaveType(leaveTypeId);
      if (response.status.response_code === 200) {
        setRows((initial) => initial.filter((row) => row.id !== leaveTypeId));
        showSnackbar(
          toastMessages.success.adminDashboard.leaveTypeDeleted,
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setDialogSubmitting(false);
    setIsSubmitting(false);
    handlCloseDailog();
  };
  /* colums for the data table */
  const columns = [
    {
      field: 'name',
      headerName: 'Leave Types',
      sortable: true,
      flex: 1
    },
    {
      field: 'no_of_leaves',
      headerName: 'Numbers',
      sortable: true,
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: LeaveTypeDataType) => (
        <>
          {true && (
            <Box sx={adminStyle.actionItems}>
              <IconButton
                size="small"
                color="primary"
                aria-label="edit"
                onClick={() => handleEditLeave(params.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                onClick={() => handleOpendailog(params.id, params.name)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </>
      )
    }
  ];

  /* UseEffects */
  useEffect(() => {
    fetchLeaveType();
  }, []);
  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtLeaveTypeName: Yup.string()
      .trim()
      .required('Please enter the Leave Type name.')
      .matches(/^^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed'),
    txtLeaveTypeNumber: Yup.number().required('Please Enter Number Of Leaves')
  });

  return (
    <AdminDashboardPage title="Manage Leave Types">
      <Grid
        container
        spacing={2}
        mb={3}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Left-aligned Button: Add Leave Type */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLeaveType}
            fullWidth
          >
            Add Leave Type
          </Button>
        </Grid>

        {/* Center-aligned Button: Entitlements */}
        <Grid item xs={12} sm={6} md={3} container justifyContent="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(EntitlementsPage)}
            fullWidth
          >
            Entitlements
          </Button>
        </Grid>

        {/* Right-aligned Search Field */}
        <Grid item xs={12} sm={6} md={3}>
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
        title={!initialValues.id ? 'Add Leave Type' : 'Edit Leave Type'}
        description="*Note: All leaves are calculated Yearly"
        open={openFormDailog}
        onSubmitAction={() => {
          if (formikRef.current) {
            formikRef.current.handleSubmit();
          }
        }}
        onCancelAction={() => setOpenFormDailog(false)}
        cancelText={!initialValues.id ? 'Back' : 'Cancel'}
        submitText={!initialValues.id ? 'Save' : 'Update'}
        isSubmitting={isSubmitting}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values
          }) => (
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextInput
                  fullWidth
                  label="Leave Type Name "
                  name="txtLeaveTypeName"
                  value={values.txtLeaveTypeName}
                  inputProps={{ maxLength: 50 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.txtLeaveTypeName && errors.txtLeaveTypeName
                  )}
                  helperText={String(
                    touched.txtLeaveTypeName && errors.txtLeaveTypeName
                  )}
                />
                <TextInput
                  fullWidth
                  label="Number Of Leaves "
                  name="txtLeaveTypeNumber"
                  value={values.txtLeaveTypeNumber}
                  inputProps={{ maxLength: 50 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.txtLeaveTypeNumber && errors.txtLeaveTypeNumber
                  )}
                  helperText={String(
                    touched.txtLeaveTypeNumber && errors.txtLeaveTypeNumber
                  )}
                />
              </Stack>
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
        onAgreeAction={() => handelDeleteLeave(deletedailog.leaveTypeId)}
      />
    </AdminDashboardPage>
  );
};

export default ManageLeaveType;
