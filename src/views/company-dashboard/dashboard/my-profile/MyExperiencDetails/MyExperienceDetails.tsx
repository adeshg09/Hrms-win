/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description My profile page to view user profile.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import {
  // Avatar,
  // Box,
  // Button,
  // Card,
  // CardActions,
  // CardContent,
  // Divider,
  Grid
  // Typography
} from '@mui/material';
// import useSnackbarClose from 'hooks/useSnackbarClose';
import { useState } from 'react';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/* Relative Imports */
// import { apiBaseUrl } from 'config/config';
// import { toastMessages } from 'constants/appConstant';
// import SessionContext from 'context/SessionContext';
// import { changeProfilePhotoRequest } from 'services/account';

/* Local Imports */
import { AdminDashboardPage } from 'components/Page';
import EditExperienceDetails from './EditExperienceDetails';
import ViewExperienceDetails from './ViewExperienceDetails';

// ----------------------------------------------------------------------

/**
 * Component to display user profile
 *
 * @component
 * @returns {JSX.Element}
 */
const MyFamilyDetails = (): JSX.Element => {
  /* Hooks */
  // const { showSnackbar } = useSnackbarClose();
  // const { user } = useContext(SessionContext);

  /* States */
  const [view, setView] = useState(false);

  const updateViewMode = (newEditMode: boolean): any => {
    setView(newEditMode);
  };

  /* Output */
  return (
    <AdminDashboardPage title="My Profile - Experience Details">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          {view ? (
            <EditExperienceDetails handleViewMode={updateViewMode} />
          ) : (
            <ViewExperienceDetails handleViewMode={updateViewMode} />
          )}
        </Grid>
      </Grid>
    </AdminDashboardPage>
  );
};

export default MyFamilyDetails;
