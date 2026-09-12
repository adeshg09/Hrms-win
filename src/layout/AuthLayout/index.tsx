/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create layout for auth pages.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React from 'react';
import { Box } from '@mui/material';

/* Relative Imports */
import Footer from 'components/Footer';
import WebsiteLogo from 'components/WebsiteLogo';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create outer design layout for all auth pages.
 *
 * @interface AuthLayoutProps
 * @property {node} children - contains the child components.
 */
export interface AuthLayoutProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Outer design layout for all auth pages
 *
 * @component
 * @param {node} children - contains the child components
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.wrapperStyle}>
      <Box sx={styles.mainStyle}>
        <Box sx={styles.logoStyle}>
          <WebsiteLogo />
        </Box>
        <Box sx={styles.formStyle}>{children}</Box>
      </Box>
      <Footer containerStyle={styles.footer} />
    </Box>
  );
};

export default AuthLayout;
