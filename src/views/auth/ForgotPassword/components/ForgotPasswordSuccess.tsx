/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create forgot password success screen.
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
import { memo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { forgotPasswordRequest } from 'services/auth';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create forgot password success message after sending the reset password link.
 *
 * @interface Props
 * @property {string} email - email to resend the reset password link again.
 * @property {string} resetPasswordLink - reset password page link to send in email
 * @property {node} children - contains data or component.
 */
export interface Props {
  email: string;
  resetPasswordLink: string;
}

// ----------------------------------------------------------------------

/**
 * Forgot password success message after sending the reset password link.
 *
 * @component
 * @param {string} email - email to resend the reset password link again.
 * @param {string} resetPasswordLink - reset password page link to send in email
 * @returns {JSX.Element}
 */
const ForgotPasswordSuccess = ({
  email,
  resetPasswordLink
}: Props): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);

  /* Functions */
  /**
   * Function to resend the reset password link
   * @returns {void}
   */
  const handleResendLink = async (): Promise<void> => {
    setLoading(true);
    try {
      if (email && resetPasswordLink) {
        const response = await forgotPasswordRequest(email, resetPasswordLink);
        if (response?.status.response_code === 200) {
          showSnackbar(toastMessages.success.auth.forgotPassword, 'success');
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /* Output */
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="subtitle1" mb={3}>
          Check your email
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          We've sent an email to your email address. <br />
          To reset your password, Click on the link sent to your email address.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          if you don't see the email, check your spam folder
        </Typography>
      </Box>
      <Box>
        <LoadingButton loading={loading} onClick={handleResendLink}>
          I didn't receive the email
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default memo(ForgotPasswordSuccess);
