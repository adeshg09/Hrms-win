/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Edit profile page to edit user details.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import {
  Box,
  Button,
  Card,
  // CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { UserFormValues } from 'models/company';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { phoneRegExp, toastMessages } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import { updateUserRequest } from 'services/master/user';

// ----------------------------------------------------------------------

interface IViewProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// ----------------------------------------------------------------------

/**
 * Component to create the edit profile page.
 *
 * @component
 * @returns {JSX.Element}
 */
const EditProfile = ({ handleViewMode }: IViewProfileProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  // const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState({
    txtFirstName: user.first_name,
    txtLastName: user.last_name,
    txtEmail: user.email,
    txtPhone: user.phone,
    // txtIpAddress: user.ip_address,
    txtEmployeeCode: user.employee_code
  } as UserFormValues);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtPhone: Yup.string()
      .min(10, 'Phone number should be 10 digits!')
      .max(10, 'Phone number should be 10 digits!')
      .matches(phoneRegExp, 'Must be a valid phone number!')
      .required('Phone number is required!')
  });

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: UserFormValues
    // { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        phone: values.txtPhone?.trim()
      };
      if (user.id) {
        requestData.modifiedBy = user.id;

        const response = await updateUserRequest(Number(user.id), requestData);

        if (response?.status.response_code === 200) {
          handleViewMode(false);
          showSnackbar(
            toastMessages.success.adminDashboard.userUpdated,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Output */
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
      }) => (
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              subheader="Please update the details below to update profile."
              title="Edit Profile"
              style={{ textAlign: 'center' }}
              titleTypographyProps={{ variant: 'h3', component: 'h3' }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    fullWidth
                    label=" First Name"
                    name="txtFirstName"
                    value={values.txtFirstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    fullWidth
                    label=" Last Name"
                    name="txtLastName"
                    value={values.txtLastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Email Address"
                    name="txtEmail"
                    value={values.txtEmail}
                    variant="outlined"
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Employee Code"
                    name="txtEmployeeCode"
                    value={values.txtEmployeeCode}
                    variant="outlined"
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Ip Address"
                    name="txtIpAddress"
                    value={values.txtIpAddress}
                    variant="outlined"
                  />
                </Grid> */}
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="txtPhone"
                    value={values.txtPhone}
                    variant="outlined"
                    inputProps={{ maxLength: 10 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.txtPhone && errors.txtPhone)}
                    helperText={touched.txtPhone && errors.txtPhone}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            {/* <CardActions> */}
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
            {/* </CardActions> */}
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;
