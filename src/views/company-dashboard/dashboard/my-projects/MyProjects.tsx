/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description My Projects Page to handle the projects.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useEffect, useState, useContext } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import { AdminDashboardPage } from 'components/Page';
import Loader from 'components/Loader';
import MenuPopover from 'components/MenuPopover';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { ProjectModel } from 'models/company';
import { getProjectsByUserIdRequest } from 'services/company/project';

/* Local Imports */
import styles from './project.style';
import ProjectItem from './ProjectItem';

// ----------------------------------------------------------------------

/* Constants */
const initialStateViewPopover = {
  open: false,
  data: null
};

// ----------------------------------------------------------------------

/**
 * Component to create the tracker listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const MyProjects = (): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setloading] = useState(true);
  const [myProject, setMyProject] = useState<ProjectModel[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewPopover, setViewPopover] = useState<any>(initialStateViewPopover);

  /* Functions */
  /**
   * function to open the view popover
   *
   * @param {object} event - event of selected lead to view
   * @param {object} data - data of selected lead to view
   * @returns {void}
   */
  const handleOpenPopover = (event: any, data: any): void => {
    setAnchorEl(event.currentTarget);
    setViewPopover({
      open: true,
      data
    });
  };

  /**
   * function to close the view popover
   *
   * @returns {void}
   */
  const handleClosePopover = (): void => {
    setAnchorEl(null);
    setViewPopover(initialStateViewPopover);
  };

  const getGetMyProjects = async (): Promise<any> => {
    setloading(true);
    try {
      const response = await getProjectsByUserIdRequest(user.id);
      if (response && response.status.response_code === 200) {
        setMyProject(response.projects || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setloading(false);
  };

  const viewItem = (title: any, value: any): JSX.Element => (
    <Grid container spacing={2}>
      <Grid item md={4} sm={4} xs={12}>
        <Typography variant="h6" pr={2} sx={styles.viewItemTitle}>
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={12}>
        <Typography variant="body1" sx={styles.viewItemBody}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );

  /* Side-Effects */
  useEffect(() => {
    getGetMyProjects();
  }, []);

  /* Output */
  return (
    <AdminDashboardPage title="My Projects">
      {!loading ? (
        <Box>
          {myProject.length > 0 ? (
            <Grid container spacing={2}>
              {myProject.map(
                (item: ProjectModel, key: any): JSX.Element => (
                  <ProjectItem
                    projectDetail={item}
                    key={key}
                    onOpenDetailPopover={handleOpenPopover}
                  />
                )
              )}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Card variant="outlined">
                <Typography sx={styles.nodatatext}>
                  <InfoOutlinedIcon sx={styles.nodataIcon} />
                  <span>Opps!! No projects are assigned to you.</span>
                </Typography>
              </Card>
            </Grid>
          )}
        </Box>
      ) : (
        <Loader />
      )}
      <MenuPopover
        id="view"
        open={viewPopover.open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        contentStyle={styles.viewPopover}
      >
        {viewPopover.data && (
          <Box sx={styles.popoverView}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 1,
                gap: 1
              }}
            >
              <Typography
                variant="h4"
                sx={[styles.viewItemTitle, { overflowWrap: 'anywhere' }]}
              >
                {viewPopover.data.name}
              </Typography>
              <Box sx={styles.closePopover}>
                <IconButton onClick={handleClosePopover} sx={styles.mbottom}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider />
            <Grid container mt={1} spacing={3} sx={styles.popoverMainBox}>
              {/* <Grid item md={12} sm={12} xs={12}>
                {viewItem('Project Name', viewPopover.data.name)}
              </Grid> */}
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Description',
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(viewPopover.data.description)
                    }}
                    sx={styles.viewItemDescriptionBody}
                  />
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Project Manager',
                  `${viewPopover.data.project_manager.first_name}` +
                    `${' '}` +
                    `${viewPopover.data.project_manager.last_name}`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Team Leader',
                  `${viewPopover.data.team_leader.first_name}` +
                    `${' '}` +
                    `${viewPopover.data.team_leader.last_name}`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Client Name', viewPopover.data.client?.name)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Client Country', viewPopover.data.client?.country)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Team Members',
                  <>
                    {viewPopover.data.team_members.map((item: any) => (
                      <Typography key={item.id}>
                        {`${viewPopover.data.team_leader.first_name}` +
                          `${' '} ` +
                          `${viewPopover.data.team_leader.last_name}` +
                          `${' '} `}
                      </Typography>
                    ))}
                  </>
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem(
                  'Estimated Time',
                  `${viewPopover.data.estimate_time} hrs`
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('Start Date', viewPopover.data.start_date)}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {viewItem('End Date', viewPopover.data.end_date)}
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                {viewPopover.data.is_active ? (
                  <>{viewItem('Status', 'Active')}</>
                ) : (
                  <>{viewItem('Status', 'In-Active')}</>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </MenuPopover>
    </AdminDashboardPage>
  );
};

export default MyProjects;
