/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Forgot password page to send the reset password link.
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
import { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import { AuthPage } from 'components/Page';

/* Local Imports */
import { ForgotPasswordForm, ForgotPasswordSuccess } from './components';
import authStyles from '../auth.style';

// ----------------------------------------------------------------------

/**
 * Component to create the forgot password form and it's outer design.
 *
 * @component
 * @returns {JSX.Element}
 */
const ForgotPassword = (): JSX.Element => {
  /* Constant */
  const resetPasswordLink = `${
    window.location.origin
  }/${PAGE_ROOT.resetPassword.relativePath.replace(':token', '')}`;

  /* States */
  const [mode, setMode] = useState('edit');
  const [email, setEmail] = useState('');

  /* Functions */
  /**
   * Function to set the email, company in state and show success message
   * @param {string} newEmail - registered email of user
   * @returns {void}
   */
  const handleSendSuccess = (newEmail: string): void => {
    setEmail(newEmail);
    setMode('view');
  };

  /* Output */
  return (
    <AuthPage title="Forgot Password">
      <Box sx={authStyles.rootStyle}>
        <Container>
          <Box mb={3}>
            {mode === 'view' ? (
              <ForgotPasswordSuccess
                email={email}
                resetPasswordLink={resetPasswordLink}
              />
            ) : (
              <>
                <Typography variant="h3" mb={3}>
                  Forgot Password
                </Typography>
                <ForgotPasswordForm
                  resetPasswordLink={resetPasswordLink}
                  onSubmitSuccess={handleSendSuccess}
                />
              </>
            )}
          </Box>
          <Box textAlign="center">
            <Button
              color="secondary"
              startIcon={<ArrowBackIcon />}
              href={PAGE_ROOT.signIn.absolutePath}
            >
              Go back to Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </AuthPage>
  );
};

export default ForgotPassword;
