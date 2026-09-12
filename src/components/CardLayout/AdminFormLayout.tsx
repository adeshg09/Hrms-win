/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create website logo component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { Card, CardHeader, Divider } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create card layout for admin dashboard forms.
 *
 * @interface AdminFormLayoutProps
 * @property {string} title - title for the card header.
 * @property {string} subtitle - sub title for the card header.
 * @property {node} children - contains data or component.
 */
export interface AdminFormLayoutProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Component to create card layout for admin dashboard forms.
 *
 * @component
 * @param {string} title - title for the card header.
 * @param {string} subtitle - sub title for the card header.
 * @param {node} children - contains data or component.
 * @returns {JSX.Element}
 */
const AdminFormLayout = ({
  title,
  subtitle = '',
  children = <></>,
  ...other
}: AdminFormLayoutProps): JSX.Element => {
  /* Output */
  return (
    <Card sx={styles.card} {...other}>
      <CardHeader
        title={title}
        subheader={subtitle}
        titleTypographyProps={{ variant: 'h3', component: 'h3' }}
      />
      <Divider />
      {children}
    </Card>
  );
};

export default memo(AdminFormLayout);
