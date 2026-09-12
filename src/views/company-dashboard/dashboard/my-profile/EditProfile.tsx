import {
  Box,
  Button,
  CardContent,
  Grid
  // MenuItem,
  // Checkbox
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
// import { ShortRoleModel } from 'models/company';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import { updateUserRequest } from 'services/company/user';
import { EditUserFormValues, UserValues } from 'models/company/employee';
import { getUserByIdRequest } from 'services/company/employee/accountSetup';
import { TextInput } from 'components/InputFields';
import Loader from 'components/Loader';

interface IEditProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

interface SavedStepData {
  data: any;
  ids?: number[] | number;
}

const EditProfile = ({ handleViewMode }: IEditProfileProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserValues | null>(null);
  const [savedStepData, setSavedStepData] = useState<{
    [key: number]: SavedStepData;
  }>({});

  const validationSchema = Yup.object().shape({
    txtFirstName: Yup.string()
      .trim()
      .required('Please enter the first name.')
      .matches(/^[a-zA-Z]+$/, 'Please enter only alphabets.'),
    txtLastName: Yup.string()
      .trim()
      .required('Please enter the last name.')
      .matches(/^[a-zA-Z]+$/, 'Please enter only alphabets.'),
    txtEmail: Yup.string()
      .trim()
      .email('Please enter the valid email address.')
      .required('Please enter the email address.')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter valid email'
      ),
    txtPhone: Yup.string().nullable(),
    chkIsActive: Yup.boolean(),
    chkShowActivity: Yup.boolean()
  });

  const initialValues: EditUserFormValues = {
    txtFirstName: userData?.first_name || '',
    txtLastName: userData?.last_name || '',
    txtEmail: userData?.email || '',
    txtPhone: userData?.phone || '',
    txtPassword: userData?.password || '',
    ddlRoles: userData?.roles || [],
    chkIsActive: userData?.is_active || false,
    chkShowActivity: userData?.show_activity || false
  };

  const handleFormSubmit = async (
    values: EditUserFormValues,
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const requestData = {
        firstName: values.txtFirstName,
        lastName: values.txtLastName,
        email: values.txtEmail,
        phone: values.txtPhone,
        roleIds: JSON.stringify(values.ddlRoles),
        isActive: values.chkIsActive,
        showActivity: values.chkShowActivity
      };

      const response = await updateUserRequest(user.id, requestData);

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        setSavedStepData((prev) => ({
          ...prev,
          0: { data: requestData, ids: response.id }
        }));
        showSnackbar(
          toastMessages.success.adminDashboard.employee.employeeAccountUpdated,
          'success'
        );
      } else if (response?.status.response_code === 206) {
        showSnackbar(toastMessages.error.adminDashboard.userDuplicate, 'error');
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getEmployeeDetailsByUserId = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getUserByIdRequest(Number(user?.id));
      if (response?.user) {
        setUserData(response.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getEmployeeDetailsByUserId();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
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
        values
        // setFieldValue
      }) => (
        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
          {loading ? (
            <Loader />
          ) : (
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    fullWidth
                    label="First Name"
                    name="txtFirstName"
                    value={values.txtFirstName}
                    inputProps={{ maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.txtFirstName && errors.txtFirstName)}
                    helperText={
                      touched.txtFirstName && errors.txtFirstName
                        ? String(errors.txtFirstName)
                        : ''
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextInput
                    fullWidth
                    label="Last Name"
                    name="txtLastName"
                    value={values.txtLastName}
                    inputProps={{ maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.txtLastName && errors.txtLastName)}
                    helperText={
                      touched.txtLastName && errors.txtLastName
                        ? String(errors.txtLastName)
                        : ''
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextInput
                    fullWidth
                    label="Email"
                    name="txtEmail"
                    type="email"
                    value={values.txtEmail}
                    inputProps={{ maxLength: 100 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.txtEmail && errors.txtEmail)}
                    helperText={
                      touched.txtEmail && errors.txtEmail
                        ? String(errors.txtEmail)
                        : ''
                    }
                  />
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
                      Back
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;
