/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Reset password page to change the password.
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
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import { AuthPage } from 'components/Page';

/* Local Imports */
import { ResetPasswordForm } from './components';
import authStyles from '../auth.style';

// ----------------------------------------------------------------------

/**
 * Component to create the reset password form and it's outer design.
 *
 * @component
 * @returns {JSX.Element}
 */
const ResetPassword = (): JSX.Element => {
  /* Constant */
  const signInPath = PAGE_ROOT.signIn.absolutePath;

  /* Hooks */
  const navigate = useNavigate();

  /* Functions */
  /**
   * function to redirect on sign in page
   * @returns {void}
   */
  const handleSubmitSuccess = (): void => {
    navigate(signInPath);
  };

  /* Output */
  return (
    <AuthPage title="Reset Password">
      <Box sx={authStyles.rootStyle}>
        <Container>
          <Box mb={3}>
            <Typography variant="h3" mb={3}>
              Reset Password
            </Typography>
            <ResetPasswordForm onSubmitSuccess={handleSubmitSuccess} />
          </Box>
          <Box textAlign="center">
            <Button
              color="secondary"
              startIcon={<ArrowBackIcon />}
              href={signInPath}
            >
              Go back to Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </AuthPage>
  );
};

export default ResetPassword;
