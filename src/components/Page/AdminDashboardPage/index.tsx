/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create admin dashboard page component.
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
  CardHeader,
  Container,
  Divider
} from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * displays title, Layout for admin dashboard components.
 *
 * @interface AdminDashboardPageProps
 * @property {string} title - contains page title in tab bar.
 * @property {node} children - contains data or component.
 */
export interface AdminDashboardPageProps {
  title?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * displays title, Layout for admin dashboard components.
 *
 * @component
 * @param {string} title - contains page title in tab bar.
 * @param {node} children - contains data or component.
 * @returns {JSX.Element}
 */
const AdminDashboardPage = forwardRef(({ title = 'HRMS', children = <>

    </>, ...other }: AdminDashboardPageProps, ref): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.rootStyle} ref={ref} {...other}>
      <Helmet>
        <title>{`${title} | HRMS`}</title>
      </Helmet>
      <Container maxWidth={false}>
        <Box sx={styles.container}>
          <CardHeader title={title} sx={styles.cardHeader} />
          <Divider sx={styles.divider} />
          <CardContent>{children}</CardContent>
        </Box>
      </Container>
    </Box>
  );
});

export default memo(AdminDashboardPage);
