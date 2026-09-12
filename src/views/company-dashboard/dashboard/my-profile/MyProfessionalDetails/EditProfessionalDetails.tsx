/* Imports */
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { ShortDesignationModel, UserProfileModel } from 'models/company';
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import {
  EditEmployeeProfessionalDetailsFormValues,
  ProfessionalDetailsValues
} from 'models/company/employee';
import {
  getEmployeeProfessionalDetailsByUserIdRequest,
  insertEmployeeProfessionalDetailRequest,
  updateEmployeeProfessionalDetailRequest
} from 'services/company/employee/professionalDetails';
import { CustomField, SelectInput, TextInput } from 'components/InputFields';
import { getDesignationsRequest } from 'services/company/designation';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Loader from 'components/Loader';
import { PAGE_SUBMODULE_COMPANY_DASHBOARD } from 'routes/paths';
import { getUsersRequest } from 'services/company/employee/accountSetup';

// ----------------------------------------------------------------------

interface IEditProfessionalDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// interface SavedStepData {
//   data: any;
//   ids?: number[] | number;
// }

// ----------------------------------------------------------------------

/**
 * Component to create the edit profile page.
 *
 * @component
 * @returns {JSX.Element}
 */
const EditProfessionalDetails = ({
  handleViewMode
}: IEditProfessionalDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  // const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  const isEmployeeSubModulePresent = user?.companySubModules?.includes(
    PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
  );

  /* States */
  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState({
    txtEmployeeCode: '',
    ddlDesignation: '',
    ddlReportingUser: '',
    txtJoinDate: '',
    ddlEmploymentType: '',
    ddlWorkingType: ''
  } as EditEmployeeProfessionalDetailsFormValues);
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState<
    Array<ShortDesignationModel>
  >([]);
  const [professionalId, setProfessionalId] = useState<number>();
  const [users, setUsers] = useState<Array<UserProfileModel>>([]);
  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtEmployeeCode: Yup.string().required('Please enter the employee code.'),
    ddlDesignation: isEmployeeSubModulePresent
      ? Yup.string()
          .min(1, 'Please select the designation.')
          .required('Please select the designation.')
      : Yup.string(),
    ddlReportingUser: Yup.string().required(
      'Please select the reporting user.'
    ),
    txtJoinDate: Yup.date()
      .required('Please enter the join date.')
      .max(new Date(), 'Join date cannot be in the future.'),
    ddlEmploymentType: Yup.string().required(
      'Please select the employment type.'
    ),
    ddlWorkingType: Yup.string().required('Please select the working type.')
  });

  /**
   * function to get all the designation with backend action
   * @return {void}
   */
  const handleGetDesignations = async (): Promise<void> => {
    try {
      const response = await getDesignationsRequest();
      if (response && response.status.response_code === 200) {
        setDesignations(response.designations);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
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
        setUsers(response?.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  const getEmployeeProfessionalDetailsByUserId = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeProfessionalDetailsByUserIdRequest(
      Number(user?.id)
    );
    setProfessionalId(response?.employeeProfessionalDetail?.id);
    console.log('res is', response);
    const professionalDetailsData: ProfessionalDetailsValues =
      response?.employeeProfessionalDetail;
    if (professionalDetailsData) {
      setInitialValuesProfessionalDetails({
        txtEmployeeCode: professionalDetailsData.employee_code,
        ddlDesignation: professionalDetailsData.designation_id,
        ddlReportingUser: professionalDetailsData.reporting_user_id,
        txtJoinDate: professionalDetailsData.joining_date,
        ddlEmploymentType: professionalDetailsData.employment_type,
        ddlWorkingType: professionalDetailsData.working_type
      });
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: EditEmployeeProfessionalDetailsFormValues,
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }
      const requestData: any = {
        employeeCode: values.txtEmployeeCode,
        designationId: values.ddlDesignation,
        reportingUserId: values.ddlReportingUser,
        joinDate: values.txtJoinDate,
        employmentType: values.ddlEmploymentType,
        workingType: values.ddlWorkingType
      };
      let response;
      if (professionalId) {
        response = await updateEmployeeProfessionalDetailRequest(
          professionalId,
          requestData
        );
      } else {
        requestData.userId = user?.id;
        response = await insertEmployeeProfessionalDetailRequest(requestData);
      }

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeProfessionalDetailsUpdated,
          'success'
        );
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    handleGetEmployees();
    handleGetDesignations();
    if (user?.id) {
      getEmployeeProfessionalDetailsByUserId();
    }
  }, [user?.id]);

  /* Output */
  return (
    <Formik
      enableReinitialize
      initialValues={initialValuesProfessionalDetails}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue
      }) => (
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              subheader="Please update the details below to update professional details."
              title="Edit Professional Details"
              style={{ textAlign: 'center' }}
              titleTypographyProps={{ variant: 'h3', component: 'h3' }}
            />
            <Divider />
            {!loading ? (
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextInput
                      fullWidth
                      label="Employee Code"
                      name="txtEmployeeCode"
                      value={values.txtEmployeeCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled
                      error={Boolean(
                        touched.txtEmployeeCode && errors.txtEmployeeCode
                      )}
                      helperText={String(
                        touched.txtEmployeeCode && errors.txtEmployeeCode
                      )}
                    />
                  </Grid>
                  {isEmployeeSubModulePresent && (
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Designation"
                        name="ddlDesignation"
                        value={values.ddlDesignation}
                        disabled
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlDesignation && errors.ddlDesignation
                        )}
                        helperText={String(
                          touched.ddlDesignation && errors.ddlDesignation
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {designations.map((option: any) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={6}>
                    <SelectInput
                      label="Select Reporting User"
                      name="ddlReportingUser"
                      value={values.ddlReportingUser}
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.ddlReportingUser && errors.ddlReportingUser
                      )}
                      helperText={String(
                        touched.ddlReportingUser && errors.ddlReportingUser
                      )}
                    >
                      <MenuItem key="-1" value="">
                        - None -
                      </MenuItem>
                      {users.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {`${option.first_name} ${option.last_name}`}
                        </MenuItem>
                      ))}
                    </SelectInput>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        openTo="day"
                        inputFormat="DD/MM/YYYY"
                        value={values.txtJoinDate}
                        onChange={(newValue: any) => {
                          setFieldValue('txtJoinDate', newValue);
                        }}
                        renderInput={(params: any) => (
                          <CustomField
                            name="txtJoinDate"
                            label="Joining Date"
                            error={Boolean(
                              touched.txtJoinDate && errors.txtJoinDate
                            )}
                            helperText={String(
                              touched.txtJoinDate && errors.txtJoinDate
                            )}
                          >
                            <TextField
                              {...params}
                              fullWidth
                              size="medium"
                              name="txtJoinDate"
                              value={values.txtJoinDate}
                              error={Boolean(
                                touched.txtJoinDate && errors.txtJoinDate
                              )}
                            />
                          </CustomField>
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <SelectInput
                      label="Employment Type"
                      name="ddlEmploymentType"
                      value={values.ddlEmploymentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.ddlEmploymentType && errors.ddlEmploymentType
                      )}
                      helperText={String(
                        touched.ddlEmploymentType && errors.ddlEmploymentType
                      )}
                    >
                      <MenuItem key="-1" value="">
                        - None -
                      </MenuItem>
                      {employeeProfessionalDetails.employmentType.map(
                        (option: any) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.name}
                          </MenuItem>
                        )
                      )}
                    </SelectInput>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <SelectInput
                      label="Work Mode"
                      name="ddlWorkingType"
                      value={values.ddlWorkingType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.ddlWorkingType && errors.ddlWorkingType
                      )}
                      helperText={String(
                        touched.ddlWorkingType && errors.ddlWorkingType
                      )}
                    >
                      <MenuItem key="-1" value="">
                        - None -
                      </MenuItem>
                      {employeeProfessionalDetails.workingType.map(
                        (option: any) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.name}
                          </MenuItem>
                        )
                      )}
                    </SelectInput>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" p={2}>
                      <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ m: 1 }}
                      >
                        {isSubmitting ? 'Please wait...' : 'Update'}
                      </LoadingButton>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleViewMode(false)}
                        sx={{ m: 1 }}
                      >
                        {id ? 'Cancel' : 'Back'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            ) : (
              <Loader />
            )}
            <Divider />
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfessionalDetails;
