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
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { useContext, useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/* Relative Imports */
import { apiBaseUrl } from 'config/config';
import { toastMessages } from 'constants/appConstant';
import SessionContext from 'context/SessionContext';
import { changeProfilePhotoRequest } from 'services/account';

/* Local Imports */
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component to display user profile
 *
 * @component
 * @returns {JSX.Element}
 */
const MyProfile = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const { user, updateProfilePicture } = useContext(SessionContext);

  /* States */
  const [view, setView] = useState(false);
  const [state, setState] = useState({ isUploading: false });
  const [loading, setLoading] = useState(false);

  const updateViewMode = (newEditMode: boolean): any => {
    setView(newEditMode);
  };

  const handleChange = async (e: any): Promise<void> => {
    try {
      setState({ isUploading: true });
      const fileList = e.target.files;

      if (fileList && fileList[0]) {
        const selectedFile = fileList[0];
        const maxFileSize: number = 4194304; // 4MB -> 4 * 1024 * 1024 – to check in KB – Kilo Bytes

        if (selectedFile.size > maxFileSize) {
          setState({ isUploading: false });
          showSnackbar('Failed!! Max allowed image size is 4 MB', 'error');
        } else {
          const allowedExt = ['png', 'jpg', 'jpeg'];
          const ext = selectedFile.name.split('.').pop().toLowerCase();
          if (!allowedExt.includes(ext)) {
            setState({ isUploading: false });
            showSnackbar('Failed!! extension error : ', 'error');
          } else if (user.id) {
            const reqData: any = {
              profilePhoto: selectedFile
            };

            const response = await changeProfilePhotoRequest(user.id, reqData);

            if (
              response?.status.response_code === 200 &&
              response.profile_photo
            ) {
              // user.profile_photo = response.profile_photo;
              console.log(response);
              updateProfilePicture(response.profile_photo);
              showSnackbar('Profile picture updated successfully!', 'success');
            } else {
              showSnackbar(toastMessages.error.common, 'error');
            }
          } else {
            showSnackbar(toastMessages.error.common, 'error');
          }
        }
      } else {
        showSnackbar('Please select the image to update.', 'error');
      }
      setState({ isUploading: false });
    } catch (error) {
      setState({ isUploading: false });
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Output */
  return (
    <Grid container spacing={3}>
      <Grid item lg={4} md={4} xs={12}>
        <Card>
          <CardContent>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Avatar
                sx={styles.avatar}
                src={`${apiBaseUrl}${user.profile_photo}`}
              />

              {state.isUploading && (
                <span>
                  <img src="/static/images/loader.gif" alt="" />
                </span>
              )}
              <Typography variant="h3" pt={2}>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body1">{user.employee_code}</Typography>
            </Box>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="center">
            <CardActions>
              <label htmlFor="ProfilePhoto">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="ProfilePhoto"
                  disabled={state.isUploading}
                  onChange={handleChange}
                />
                <Button
                  color="primary"
                  fullWidth
                  variant="text"
                  component="span"
                  disabled={state.isUploading}
                  startIcon={<CloudUploadIcon />}
                >
                  Update Profile Picture
                </Button>
              </label>
            </CardActions>
          </Box>
        </Card>
      </Grid>
      <Grid item lg={8} md={8} xs={12}>
        {view ? (
          <EditProfile handleViewMode={updateViewMode} />
        ) : (
          <ViewProfile handleViewMode={updateViewMode} />
        )}
      </Grid>
    </Grid>
  );
};

export default MyProfile;
