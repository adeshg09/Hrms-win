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
import EditFamilyDetails from './EditFamilyDetails';
import ViewFamilyDetails from './ViewFamilyDetails';

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
    <AdminDashboardPage title="My Profile - Family Details">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          {view ? (
            <EditFamilyDetails handleViewMode={updateViewMode} />
          ) : (
            <ViewFamilyDetails handleViewMode={updateViewMode} />
          )}
        </Grid>
      </Grid>
    </AdminDashboardPage>
  );
};

export default MyFamilyDetails;
