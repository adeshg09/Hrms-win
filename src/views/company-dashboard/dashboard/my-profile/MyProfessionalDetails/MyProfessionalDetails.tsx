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
// import styles from './index.style';
import EditProfessionalDetails from './EditProfessionalDetails';
import ViewProfessionalDetails from './ViewProfessionalDetails';

// ----------------------------------------------------------------------

/**
 * Component to display user profile
 *
 * @component
 * @returns {JSX.Element}
 */
const MyProfessionalDetails = (): JSX.Element => {
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
    <AdminDashboardPage title="My Profile - Professional Details">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          {view ? (
            <EditProfessionalDetails handleViewMode={updateViewMode} />
          ) : (
            <ViewProfessionalDetails handleViewMode={updateViewMode} />
          )}
        </Grid>
      </Grid>
    </AdminDashboardPage>
  );
};

export default MyProfessionalDetails;
