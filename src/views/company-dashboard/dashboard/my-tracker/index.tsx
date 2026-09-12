/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage tracker Page to handle the trackers.
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
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { format } from 'date-fns';
import { Box, Grid, TextField } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import { apiBaseUrl } from 'config/config';
import { AdminDashboardPage } from 'components/Page';
import Loader from 'components/Loader';
import Accordian from 'components/Accordian';
import {
  TrackerDetailCard,
  TrackerDetailHeader,
  ViewScreenShot
} from 'components/Tracker';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import calculateTrackerTiming from 'utility/calculateTrackerTiming';
import {
  ShortProjectModel,
  TrackerDetailModel,
  TrackerModel,
  UserProjectTrackerModel
} from 'models/company';
import { getProjectListByUserIdRequest } from 'services/company/project';
import { GetTrackingsRequest } from 'services/company/tracker';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component to create the tracker listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const MyTracker = (): JSX.Element => {
  /* Constants */
  const currentDate = new Date();
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  /* Hooks */
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  /* States */
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<Array<ShortProjectModel>>([]);

  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const [trackerUsers, setTrackerUsers] = useState<
    Array<UserProjectTrackerModel>
  >([]);

  const [viewScreenShot, setViewScreenShot] = useState<string>('');

  /**
   * function to get all the projects
   *
   * @returns {void}
   */
  const handleGetProjects = async (): Promise<void> => {
    try {
      const response = await getProjectListByUserIdRequest(user.id);
      if (
        response &&
        response.status.response_code === 200 &&
        response.projects
      ) {
        setProjects(response.projects);
      } else {
        setProjects([]);
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      setProjects([]);
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the tracking information
   *
   * @returns {void}
   */
  const handleGetTracker = async (): Promise<void> => {
    const date = format(selectedDate, 'yyyy-MM-dd');
    const response = await GetTrackingsRequest(
      user.id,
      Number(selectedProject) || null,
      date
    );
    if (response?.status.response_code === 200) {
      const updatedTrackerUsers = calculateTrackerTiming(response.users);
      setTrackerUsers(updatedTrackerUsers);
    } else {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  const handleProjectChange = async (event: any): Promise<void> => {
    const selectedProjectId = Number(event.target.value);
    if (selectedProjectId > 0) {
      setSelectedProject(selectedProjectId.toString());
    } else {
      setSelectedProject('');
    }
  };

  const handleDateChange = (event: any): void => {
    setSelectedDate(new Date(event));
  };

  /**
   * Call initial functions
   * @returns {void}
   */
  const handleInitialFunctions = async (): Promise<void> => {
    setLoading(true);
    await handleGetProjects();
    await handleGetTracker();
    setLoading(false);
  };
  /**
   * Call state change functions
   * @returns {void}
   */
  const handleStateChange = async (): Promise<void> => {
    setLoading(true);
    await handleGetTracker();
    setLoading(false);
  };

  useEffect(() => {
    handleInitialFunctions();
  }, []);

  useEffect(() => {
    handleStateChange();
  }, [selectedProject, selectedDate]);

  return (
    <AdminDashboardPage title="My Tracker">
      <Grid container spacing={2} direction="row">
        <Grid item md={4} sm={6} xs={12} />
        <Grid item md={4} sm={6} xs={12}>
          <TextField
            select
            fullWidth
            size="medium"
            label="Select Project"
            name="ddlProjects"
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            value={selectedProject}
            onChange={handleProjectChange}
          >
            <option value="">- None -</option>
            {projects.map((option: ShortProjectModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              maxDate={currentDate}
              openTo="day"
              inputFormat="DD/MM/YYYY"
              value={selectedDate}
              label="Select Date"
              onChange={handleDateChange}
              renderInput={(params: any) => (
                <TextField
                  fullWidth
                  size="medium"
                  name="txtSelectDate"
                  label="Select Date"
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      {!loading ? (
        <>
          {trackerUsers.length > 0 ? (
            <>
              {trackerUsers.map((trackerUser: UserProjectTrackerModel) => {
                const { trackers } = trackerUser;
                return (
                  <Accordian
                    key={trackerUser.id}
                    defaultExpanded
                    title={`${trackerUser.first_name} ${trackerUser.last_name}`}
                    workingTime={trackerUser.totalWorkingTime}
                    idealTime={trackerUser.totalIdealTime}
                  >
                    {trackers.map((tracker: TrackerModel, tIndex: number) => {
                      const { trackerDetail } = tracker;
                      const project = tracker.trackerProject;
                      const startTime = moment(
                        trackerDetail[0].capture_time,
                        'HH:mm:ss'
                      );
                      const endTime = moment(
                        trackerDetail[trackerDetail.length - 1].capture_time,
                        'HH:mm:ss'
                      );

                      return (
                        <Box key={tracker.id} sx={styles.flexBox}>
                          <AccountTreeIcon sx={styles.projectIcon} />
                          <Box style={{ flex: 1 }}>
                            <TrackerDetailHeader
                              projectName={project.name}
                              taskSummary={tracker.task_summary}
                              startTime={startTime}
                              endTime={endTime}
                              workingTime={tracker.workingTime}
                              idealTime={tracker.idealTime}
                            />
                            <Grid container spacing={3} direction="row">
                              {trackerDetail.map(
                                (trackerItem: TrackerDetailModel) => {
                                  return (
                                    <Grid
                                      item
                                      md={2}
                                      sm={3}
                                      xs={12}
                                      key={trackerItem.id}
                                      onClick={() => {
                                        setViewScreenShot(
                                          `${apiBaseUrl}/${trackerItem.screen_shot}`
                                        );
                                      }}
                                    >
                                      <TrackerDetailCard
                                        trackerDetail={trackerItem}
                                      />
                                    </Grid>
                                  );
                                }
                              )}
                            </Grid>
                            {tIndex < trackers.length - 1 && (
                              <Box sx={styles.hr} />
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Accordian>
                );
              })}
              {!!viewScreenShot && (
                <ViewScreenShot
                  screenShotUrl={viewScreenShot}
                  onClose={() => setViewScreenShot('')}
                />
              )}
            </>
          ) : (
            <Box component="h4" textAlign="center" mt={8}>
              Data is not available for the selected options.
            </Box>
          )}
        </>
      ) : (
        <Loader />
      )}
    </AdminDashboardPage>
  );
};

export default MyTracker;
