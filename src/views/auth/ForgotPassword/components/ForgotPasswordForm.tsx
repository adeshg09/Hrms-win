/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create forgot password form.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 24/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { TextInput } from 'components/InputFields';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { forgotPasswordRequest } from 'services/auth';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create forgot password form to send the reset password link in email.
 *
 * @interface Props
 * @property {string} resetPasswordLink - reset password page link to send in email
 * @property {function} onSubmitSuccess - callback function on successful submission of forgot password form
 */
export interface Props {
  resetPasswordLink: string;
  onSubmitSuccess: (email: string) => void;
}

// ----------------------------------------------------------------------

/**
 * Forgot password form to send the reset password link in email
 *
 * @component
 * @param {string} resetPasswordLink - reset password page link to send in email
 * @param {function} onSubmitSuccess - callback function on successful submission of forgot password form
 * @returns {JSX.Element}
 */
const ForgotPasswordForm = ({
  resetPasswordLink,
  onSubmitSuccess
}: Props): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* Constants */
  const initialValues = {
    txtEmail: ''
  };

  /* Functions */
  /**
   * Submit function to send the reset password link
   * @param {object} values - input values of form
   * @returns {void}
   */
  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      const response = await forgotPasswordRequest(
        values.txtEmail,
        resetPasswordLink
      );
      if (response?.status.response_code === 200) {
        showSnackbar(toastMessages.success.auth.forgotPassword, 'success');
        onSubmitSuccess(values.txtEmail);
      } else if (response?.status.response_code === 203) {
        showSnackbar(toastMessages.error.auth.notRegistered, 'error');
      } else if (response?.status.response_code === 204) {
        showSnackbar(toastMessages.error.auth.notActive, 'error');
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtEmail: Yup.string()
      .email('Please enter the valid email address.')
      .required('Please enter your registered email address.')
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
            <TextInput
              name="txtEmail"
              label="Email Address"
              placeholder="Enter email address"
              value={values.txtEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtEmail && errors.txtEmail)}
              helperText={String(touched.txtEmail && errors.txtEmail)}
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

export default memo(ForgotPasswordForm);
