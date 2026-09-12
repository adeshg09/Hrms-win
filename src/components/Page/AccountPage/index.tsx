/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create account page component.
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
import {
  Box,
  CardContent,
  // CardHeader,
  Container
  // Divider
} from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * displays title, Layout for account components.
 *
 * @interface AccountPageProps
 * @property {string} title - contains page title in tab bar.
 * @property {node} children - contains data or component.
 */
export interface AccountPageProps {
  title?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * displays title, Layout for account components.
 *
 * @component
 * @param {string} title - contains page title in tab bar.
 * @param {node} children - contains data or component.
 * @returns {JSX.Element}
 */
const AccountPage = forwardRef(({ title = 'TE Projects', children = <>

    </>, ...other }: AccountPageProps, ref): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.rootStyle} ref={ref} {...other}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container maxWidth={false}>
        <Box sx={styles.container}>
          <CardContent sx={styles.cardContent}>{children}</CardContent>
        </Box>
      </Container>
    </Box>
  );
});

export default memo(AccountPage);
