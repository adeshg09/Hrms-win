/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Change password component to handle the user account.
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
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import { TextInput } from 'components/InputFields';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { changePasswordRequest } from 'services/account';

/* Local Imports */

// ----------------------------------------------------------------------

/* Types/Interfaces */
export interface ChangePasswordFormValues {
  txtOldPassword: string;
  txtNewPassword: string;
  txtConfirmPassword: string;
}

// ----------------------------------------------------------------------

/* Constants */

// ----------------------------------------------------------------------

/**
 * Component to create the change password for my account page.
 *
 * @component
 * @returns {JSX.Element}
 */
const ChangePassword = (): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState({
    txtOldPassword: '',
    txtNewPassword: '',
    txtConfirmPassword: ''
  } as ChangePasswordFormValues);

  /* Functions */
  /**
   * Submit function to change password with backend action
   * @param {ChangePasswordFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: ChangePasswordFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        oldPassword: values.txtOldPassword,
        newPassword: values.txtNewPassword,
        modifiedBy: user.id
      };
      const response = await changePasswordRequest(user.id, requestData);
      if (response?.status.response_code === 200) {
        showSnackbar(toastMessages.success.account.changePassword, 'success');
        resetForm();
        // navigate(manageRolePath);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Side-Effects */

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtOldPassword: Yup.string().max(100).required('Old password is required.'),
    txtNewPassword: Yup.string()
      .min(7, 'Password should be minimum 7 characters.')
      .max(100, 'Password should be maximum 100 characters.')
      .required('Please enter the new password.')
      .test(
        'passwords-match',
        'New password must be different from old password.',
        function (value, context) {
          return context.parent.txtOldPassword !== value;
        }
      ),
    txtConfirmPassword: Yup.string()
      .required('Please enter the confirm password.')
      .oneOf([Yup.ref('txtNewPassword')], 'Passwords must match!')
  });

  /* Output */
  return (
    // <AdminDashboardPage title="Account">
    // <AdminFormLayout
    //   title="Change Password"
    //   subtitle="Please change the below details to change password."
    // >
    <Formik
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
          <Card sx={{ maxWidth: 800, margin: '0 auto' }}>
            <CardHeader
              subheader="Please change the below details to change password."
              title="Change Password"
              style={{ textAlign: 'center' }}
              titleTypographyProps={{ variant: 'h3', component: 'h3' }}
            />
            <Divider />
            <CardContent>
              <Box mb={3}>
                <TextInput
                  fullWidth
                  label="Old Password"
                  name="txtOldPassword"
                  type="password"
                  value={values.txtOldPassword}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.txtOldPassword && errors.txtOldPassword
                  )}
                  helperText={String(
                    touched.txtOldPassword && errors.txtOldPassword
                  )}
                />
              </Box>
              <Box mb={3}>
                <TextInput
                  fullWidth
                  label="New Password"
                  name="txtNewPassword"
                  type="password"
                  value={values.txtNewPassword}
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.txtNewPassword && errors.txtNewPassword
                  )}
                  helperText={String(
                    touched.txtNewPassword && errors.txtNewPassword
                  )}
                />
              </Box>
              <TextInput
                fullWidth
                label="Confirm Password"
                name="txtConfirmPassword"
                type="password"
                value={values.txtConfirmPassword}
                inputProps={{ maxLength: 100 }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched.txtConfirmPassword && errors.txtConfirmPassword
                )}
                helperText={String(
                  touched.txtConfirmPassword && errors.txtConfirmPassword
                )}
              />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'center' }}>
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
              {/* <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate(manageRolePath)}
                >
                  Back
                </Button> */}
            </CardActions>
          </Card>
        </Form>
      )}
    </Formik>
    // </AdminFormLayout>
    // </AdminDashboardPage>
  );
};

export default ChangePassword;
