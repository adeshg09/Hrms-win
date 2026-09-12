/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Sign in page to validate the credentials.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 23/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useContext } from 'react';
import { Box, Container, Typography } from '@mui/material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import { AuthPage } from 'components/Page';

/* Local Imports */
import { SignInForm } from './components';
import authStyles from '../auth.style';

// ----------------------------------------------------------------------

/**
 * Component to create the signin form and it's outer design.
 *
 * @component
 * @returns {JSX.Element}
 */
const SignIn = (): JSX.Element => {
  /* Hooks */
  const context = useContext(SessionContext);

  /* Functions */
  /**
   * function to set token and user details in session context.
   * @param {string} token - auth token to set for api validations
   * @param {boolean} rememberMe - flag to remember user for 30 days
   * @returns {void}
   */
  const handleSignIn = (token: string, rememberMe: boolean): void => {
    context.LoginUser(token, rememberMe);
  };

  /* Output */
  return (
    <AuthPage title="Sign In">
      <Box sx={authStyles.rootStyle}>
        <Container>
          <Typography variant="h3" mb={3}>
            Sign In
          </Typography>
          <SignInForm onSubmitSuccess={handleSignIn} />
        </Container>
      </Box>
    </AuthPage>
  );
};

export default SignIn;
