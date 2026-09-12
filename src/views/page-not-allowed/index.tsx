/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description 400 Error or not found page of website
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
import { Box, Button, Container, Typography } from '@mui/material';

/* Relative Imports */
import { AuthPage } from 'components/Page';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component to create the 400 Error or not found page.
 *
 * @component
 * @return {JSX.Element}
 */
const PageNotFound = (): JSX.Element => {
  /* Output */
  return (
    <AuthPage height="100%">
      <Box sx={styles.rootStyle}>
        <Container maxWidth={false}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Sorry, page not allowed!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, you are not allowed on this page. Perhaps you’ve mistyped
              the URL? Be sure to check your spelling.
            </Typography>

            <Box
              component="img"
              alt="notfound"
              src="/assets/illustrations/illustration_404.svg"
              sx={{ width: '100%', maxHeight: 240, my: { xs: 5, sm: 10 } }}
            />
            <Button href="/" size="large" variant="contained" color="secondary">
              Go to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </AuthPage>
  );
};

export default PageNotFound;
