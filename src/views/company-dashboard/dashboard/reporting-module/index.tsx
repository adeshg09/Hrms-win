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
import { useEffect, useState } from 'react';
import moment from 'moment';
import { format } from 'date-fns';
import { Box, Grid, TextField } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
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
  ProjectModel,
  ShortUserModel,
  TrackerDetailModel,
  TrackerModel,
  UserProjectTrackerModel
} from 'models/company';
import { getUsersRequest } from 'services/company/user';
import { getProjectRequest } from 'services/company/project';
import { GetTrackingsRequest } from 'services/company/tracker';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component to create tracker reporting.
 *
 * @component
 * @returns {JSX.Element}
 */
const ReportingModule = (): JSX.Element => {
  /* Constants */
  const currentDate = new Date();
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<Array<ShortUserModel>>([]);
  const [projects, setProjects] = useState<Array<ProjectModel>>([]);

  const [filteredUsers, setFilteredUsers] = useState<Array<ShortUserModel>>([]);

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const [trackerUsers, setTrackerUsers] = useState<
    Array<UserProjectTrackerModel>
  >([]);

  const [viewScreenShot, setViewScreenShot] = useState<string>('');

  /**
   * function to get all the users
   *
   * @returns {void}
   */
  const handleGetUsers = async (): Promise<void> => {
    try {
      const response = await getUsersRequest();
      if (response?.status.response_code === 200 && response.users) {
        setUsers(response.users);
        setFilteredUsers(response.users);
      } else {
        setUsers([]);
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      setUsers([]);
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the projects
   *
   * @returns {void}
   */
  const handleGetProjects = async (): Promise<void> => {
    try {
      const response = await getProjectRequest();
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
      Number(selectedUser) || null,
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
      const project = projects.find((x) => x.id === selectedProjectId);
      if (project) {
        const projectUsers = [
          project.project_manager,
          project.team_leader,
          ...project.team_members
        ];
        // Filter out duplicates based on the `id` property
        const uniqueUsers = projectUsers.filter(
          (value, index, self) =>
            index === self.findIndex((item) => item.id === value.id)
        );
        setFilteredUsers(uniqueUsers);
        setSelectedProject(selectedProjectId.toString());
      }
    } else {
      setFilteredUsers(users);
      setSelectedProject('');
    }
    setSelectedUser('');
  };

  const handleUserChange = async (event: any): Promise<void> => {
    const selectedUserId = Number(event.target.value);
    if (selectedUserId > 0) {
      setSelectedUser(selectedUserId.toString());
    } else {
      setSelectedUser('');
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
    await handleGetUsers();
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
  }, [selectedProject, selectedUser, selectedDate]);

  return (
    <AdminDashboardPage title="Tracker">
      <Grid container spacing={2} direction="row">
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
            {projects.map((option: ProjectModel) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <TextField
            select
            fullWidth
            size="medium"
            label="Select Employee"
            name="ddlUser"
            variant="outlined"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            value={selectedUser}
            onChange={handleUserChange}
          >
            <option value="">- None -</option>
            {filteredUsers.map((option: any) => (
              <option key={option.id} value={option.id}>
                {`${option.first_name} ${option.last_name} `}
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
              // onAccept={handleDateChange}
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
                    defaultExpanded={false}
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

export default ReportingModule;
