/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create layout for company dashboard pages.
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
import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';

/* Relative Imports */
import Footer from 'components/Footer';

/* Local Imports */
import { appVersion } from 'config/config';
import { getAppVersion } from 'services/company/user';
import { AlertDialog } from 'components/Dialog';
import SessionContext from 'context/SessionContext';
import { Header, Sidebar } from './components';
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create outer design layout for all company dashboard pages.
 *
 * @interface CompanyDashboardLayoutProps
 * @property {node} children - contains the child components.
 */
export interface CompanyDashboardLayoutProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Outer design layout for all company dashboard pages
 *
 * @component
 * @param {node} children - contains the child components
 */
const CompanyDashboardLayout: React.FC<CompanyDashboardLayoutProps> = ({
  children
}): JSX.Element => {
  /* States */
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [version, setVersion] = useState(-1);

  /* Hooks */
  // const { company } = useContext(SessionContext);

  /**
   * function to handle opening the popover
   * @returns {void}
   */
  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
    localStorage.removeItem('updateDialogBox');
  };

  useEffect(() => {
    if (version !== -1) {
      if (version !== parseInt(appVersion || '', 10)) {
        handleDialogOpen();
      }
    }
  }, [version]);

  const checkVersion = async (): Promise<void> => {
    try {
      const res = await getAppVersion();
      setVersion(parseInt(res?.buildNumber || '', 10));
    } catch (error) {
      // console.log(error);
    }
  };
  const showDialogBox = localStorage.getItem('updateDialogBox');

  useEffect(() => {
    checkVersion();
  }, []);

  /* Output */
  return (
    <Box sx={styles.rootStyle}>
      {showDialogBox && (
        <AlertDialog
          open={openDialog}
          description="New Update Available. Select the OS from the dropdown and download the latest installer?"
          onAgreeAction={handleDialogClose}
        />
      )}
      <Sidebar
        openMobile={isMobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <Box sx={styles.wrapperStyle}>
        <Header onMobileNavOpen={() => setMobileNavOpen(true)} />
        <Box sx={styles.containerStyle}>{children}</Box>
        <Footer containerStyle={styles.footer} />
      </Box>
    </Box>
  );
};

export default CompanyDashboardLayout;
