/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create auth page component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 18/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React, { forwardRef, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, BoxProps } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * displays title, Layout for Auth components.
 *
 * @interface AuthPageProps
 * @property {string} title - contains page title in tab bar.
 * @property {node} children - contains data or component.
 * @returns {JSX.Element}
 */
export interface AuthPageProps extends BoxProps {
  title?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * displays title, Layout for Auth components.
 *
 * @component
 * @param {string} title - contains page title in tab bar.
 * @param {node} children - contains data or component.
 * @returns {JSX.Element}
 */
const AuthPage = forwardRef(({ title = 'TE Projects', children = <>

    </>, ...other }: AuthPageProps, ref): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.rootStyle} ref={ref} {...other}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  );
});

export default memo(AuthPage);
