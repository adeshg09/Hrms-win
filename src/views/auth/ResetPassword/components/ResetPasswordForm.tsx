/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create reset password form.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 25/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PasswordInput } from 'components/InputFields';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { resetPasswordRequest } from 'services/auth';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create reset password form to change the password.
 *
 * @interface Props
 * @property {function} onSubmitSuccess - callback function on successful submission of reset password form
 */
export interface Props {
  onSubmitSuccess: () => void;
}

// ----------------------------------------------------------------------

/**
 * Reset password form to change the password
 *
 * @component
 * @param {function} onSubmitSuccess - callback function on successful submission of reset password form
 * @returns {JSX.Element}
 */
const ResetPasswordForm = ({ onSubmitSuccess }: Props): JSX.Element => {
  /* Constant */
  const initialValues = {
    txtPassword: '',
    txtConfirmPassword: ''
  };

  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const { token } = useParams();

  /* Functions */
  /**
   * Submit function to reset the password
   * @param {object} values - input values of form
   * @returns {void}
   */
  const handleFormSubmit = async (values: any): Promise<any> => {
    try {
      const response = await resetPasswordRequest(
        token || '',
        values.txtPassword
      );
      if (response?.status.response_code === 200) {
        showSnackbar(toastMessages.success.auth.resetPassword, 'success');
        onSubmitSuccess();
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Form validation schema */
  const validationSchema = Yup.object({
    txtPassword: Yup.string()
      .min(7, 'Please enter minimum 7 characters.')
      .max(100, 'Please enter less than 100 characters.')
      .required('Please enter new password.'),
    txtConfirmPassword: Yup.string()
      .oneOf([Yup.ref('txtPassword'), undefined], 'Passwords not matched.')
      .required('Please confirm your password.')
  });

  /* Output */
  return (
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
          <Box mb={3}>
            <PasswordInput
              label="New Password"
              name="txtPassword"
              placeholder="Enter password"
              value={values.txtPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtPassword && errors.txtPassword)}
              helperText={String(touched.txtPassword && errors.txtPassword)}
            />
          </Box>
          <Box mb={3}>
            <PasswordInput
              name="txtConfirmPassword"
              label="Confirm Password"
              placeholder="Enter confirm password"
              value={values.txtConfirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(
                touched.txtConfirmPassword && errors.txtConfirmPassword
              )}
              helperText={String(
                touched.txtConfirmPassword && errors.txtConfirmPassword
              )}
            />
          </Box>
          <Box>
            <LoadingButton
              fullWidth
              type="submit"
              size="large"
              variant="contained"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default memo(ResetPasswordForm);
