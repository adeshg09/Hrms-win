/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create project page to add/edit projects.
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
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import {
  AutoCompleteInput,
  CustomField,
  SelectInput,
  TextInput
} from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import QuillEditor from 'components/QuillEditor';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  ProjectFormValues,
  ShortUserModel,
  ClientModel,
  ProjectModel
} from 'models/company';
import { getUsersByCompanyIdRequest } from 'services/master/user';
import { getClientsRequest } from 'services/company/client';
import {
  getProjectByIdRequest,
  insertProjectRequest,
  updateProjectRequest
} from 'services/company/project';

/* Local Imports */
import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* Constants */
const manageProjectPath = PAGE_COMPANY_DASHBOARD.projects.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update project.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateProject = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<ShortUserModel>>([]);
  const [clients, setClients] = useState<Array<ClientModel>>([]);

  const [initialValues, setInitialValues] = useState({
    txtProjectName: '',
    txtDescription: '',
    ddlProjectManager: '',
    ddlTeamLeader: '',
    ddlTeamMembers: [],
    ddlClient: '',
    txtStartDate: '',
    txtEndDate: '',
    estimateTime: '',
    chkIsActive: false
  } as ProjectFormValues);

  /* Functions */
  /**
   * function to get all the users with backend action
   *
   * @returns {void}
   */
  const handleGetUsers = async (): Promise<void> => {
    try {
      const response = await getUsersByCompanyIdRequest(user.company?.id);
      if (response?.status.response_code === 200) {
        setUsers(response.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the clients with backend action
   *
   * @returns {void}
   */
  const handleGetClients = async (): Promise<void> => {
    try {
      const response = await getClientsRequest();
      if (response?.status.response_code === 200) {
        setClients(response.clients || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };
  /**
   * function to get the project  by id with backend action
   * @param {string} projectId - id of project to fetch the detail
   * @returns {void}
   */
  const getProjectById = async (projectId: string): Promise<void> => {
    try {
      const response = await getProjectByIdRequest(Number(projectId));
      if (response && response.status.response_code === 200) {
        const projectData: ProjectModel = response.project;
        setInitialValues({
          txtProjectName: projectData.name,
          txtDescription: projectData.description,
          ddlProjectManager: projectData.project_manager.id || '',
          ddlTeamLeader: projectData.team_leader.id,
          ddlTeamMembers: projectData.team_members.map((item) => item.id),
          ddlClient: projectData.client?.id || '',
          txtStartDate: projectData.start_date,
          txtEndDate: projectData.end_date,
          estimateTime: projectData.estimate_time,
          chkIsActive: projectData.is_active
        });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * Submit function to save/update project with backend action
   * @param {ProjectFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: ProjectFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        projectName: values.txtProjectName.trim(),
        description: values.txtDescription,
        projectManagerId: values.ddlProjectManager,
        teamLeaderId: values.ddlTeamLeader,
        clientId: values.ddlClient,
        startDate: values.txtStartDate,
        endDate: values.txtEndDate || null,
        estimateTime: values.estimateTime,
        teamMemberIds: JSON.stringify(values.ddlTeamMembers || ''),
        isActive: values.chkIsActive
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateProjectRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.projectUpdated,
            'success'
          );
          navigate(manageProjectPath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.projectDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertProjectRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.projectSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.projectDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * Call initial functions
   * @returns {void}
   */
  const handleInitialFunctions = async (): Promise<void> => {
    setLoading(true);
    await handleGetUsers();
    await handleGetClients();
    if (id) {
      await getProjectById(id);
    }
    setLoading(false);
  };

  /* Side-Effects */
  useEffect(() => {
    handleInitialFunctions();
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtProjectName: Yup.string().trim().required('Please enter project name.'),
    txtDescription: Yup.string()
      .trim()
      .required('Please enter the description.'),
    ddlProjectManager: Yup.string()
      .trim()
      .required('Please select a project manager.'),
    ddlTeamLeader: Yup.string().trim().required('Please select a team leader.'),
    ddlTeamMembers: Yup.array()
      .min(1, 'Please enter at least one team member.')
      .required('Please select team members.'),
    estimateTime: Yup.number()
      .required('Please enter the estimate time.')
      .positive('Please enter valid time.')
      .typeError('Please enter valid time.'),
    txtStartDate: Yup.string().required('Please enter the start date.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Projects">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Projects' : 'Add Projects'}
          subtitle={
            id
              ? 'Please update the details below to update project.'
              : 'Please fill the below details to create new project.'
          }
        >
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              touched,
              values
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextInput
                        fullWidth
                        label="Project Name"
                        name="txtProjectName"
                        value={values.txtProjectName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtProjectName && errors.txtProjectName
                        )}
                        helperText={String(
                          touched.txtProjectName && errors.txtProjectName
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <CustomField
                        name="txtDescription"
                        label="Description"
                        error={Boolean(
                          touched.txtDescription && errors.txtDescription
                        )}
                        helperText={String(
                          touched.txtDescription && errors.txtDescription
                        )}
                      >
                        <QuillEditor
                          value={values.txtDescription}
                          setFieldValue={(e) => {
                            setFieldValue('txtDescription', e);
                          }}
                          placeholder="Enter the description"
                        />
                      </CustomField>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <SelectInput
                        label="Select Project Manager"
                        name="ddlProjectManager"
                        value={values.ddlProjectManager}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            'ddlTeamMembers',
                            values.ddlTeamMembers.filter(
                              (val) => val !== e.target.value
                            )
                          );
                        }}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlProjectManager && errors.ddlProjectManager
                        )}
                        helperText={String(
                          touched.ddlProjectManager && errors.ddlProjectManager
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {users.map((option: ShortUserModel) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.first_name} {option.last_name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <SelectInput
                        label="Select Team Leader"
                        name="ddlTeamLeader"
                        value={values.ddlTeamLeader}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            'ddlTeamMembers',
                            values.ddlTeamMembers.filter(
                              (val) => val !== e.target.value
                            )
                          );
                        }}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlTeamLeader && errors.ddlTeamLeader
                        )}
                        helperText={String(
                          touched.ddlTeamLeader && errors.ddlTeamLeader
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {users.map((option: ShortUserModel) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.first_name} {option.last_name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <AutoCompleteInput
                        multiple
                        label="Select Team Members"
                        name="ddlTeamMembers"
                        value={values.ddlTeamMembers}
                        data={
                          users
                            ?.filter(
                              (val: ShortUserModel) =>
                                !(
                                  val.id === values.ddlProjectManager ||
                                  val.id === values.ddlTeamLeader
                                )
                            )
                            .map((val: ShortUserModel) => val.id) || []
                        }
                        originalData={users?.filter(
                          (val: ShortUserModel) =>
                            !(
                              val.id === values.ddlProjectManager ||
                              val.id === values.ddlTeamLeader
                            )
                        )}
                        itemId="id"
                        itemName="first_name"
                        placeholder="Search Name"
                        limitTags={3}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {users?.find(
                              (val: ShortUserModel) => val.id === option
                            )?.first_name || ''}{' '}
                            {users?.find(
                              (val: ShortUserModel) => val.id === option
                            )?.last_name || ''}
                          </MenuItem>
                        )}
                        onChange={(e: any) => {
                          setFieldValue('ddlTeamMembers', e);
                        }}
                        error={Boolean(
                          touched.ddlTeamMembers && errors.ddlTeamMembers
                        )}
                        helperText={String(
                          touched.ddlTeamMembers && errors.ddlTeamMembers
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <SelectInput
                        label="Select Client"
                        name="ddlClient"
                        value={values.ddlClient}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.ddlClient && errors.ddlClient)}
                        helperText={String(
                          touched.ddlClient && errors.ddlClient
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {clients.map((option: ClientModel) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          openTo="day"
                          inputFormat="DD/MM/YYYY"
                          value={values.txtStartDate}
                          onChange={(newValue: any) => {
                            setFieldValue('txtStartDate', newValue);
                          }}
                          renderInput={(params: any) => (
                            <CustomField
                              name="txtStartDate"
                              label="Start Date"
                              error={Boolean(
                                touched.txtStartDate && errors.txtStartDate
                              )}
                              helperText={String(
                                touched.txtStartDate && errors.txtStartDate
                              )}
                            >
                              <TextField
                                {...params}
                                fullWidth
                                size="medium"
                                name="txtStartDate"
                                value={values.txtStartDate}
                                error={Boolean(
                                  touched.txtStartDate && errors.txtStartDate
                                )}
                              />
                            </CustomField>
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          openTo="day"
                          inputFormat="DD/MM/YYYY"
                          value={values.txtEndDate}
                          onChange={(newValue: any) => {
                            setFieldValue('txtEndDate', newValue);
                          }}
                          renderInput={(params: any) => (
                            <CustomField
                              name="txtEndDate"
                              label="End Date"
                              error={Boolean(
                                touched.txtEndDate && errors.txtEndDate
                              )}
                              helperText={String(
                                touched.txtEndDate && errors.txtEndDate
                              )}
                            >
                              <TextField
                                {...params}
                                fullWidth
                                size="medium"
                                name="txtEndDate"
                                value={values.txtEndDate}
                                error={Boolean(
                                  touched.txtEndDate && errors.txtEndDate
                                )}
                              />
                            </CustomField>
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextInput
                        fullWidth
                        label="Estimate Time"
                        name="estimateTime"
                        value={values.estimateTime}
                        inputProps={{ maxLength: 5 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.estimateTime && errors.estimateTime
                        )}
                        helperText={String(
                          touched.estimateTime && errors.estimateTime
                        )}
                        endAdornment="hrs"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="chkIsActive"
                            checked={values.chkIsActive}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label={
                          <Typography variant="body2" ml={2}>
                            Is Active
                          </Typography>
                        }
                        sx={adminStyle.formControlLabel}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {id ? 'Update' : 'Save'}
                  </LoadingButton>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => navigate(manageProjectPath)}
                  >
                    {id ? 'Cancel' : 'Back'}
                  </Button>
                </CardActions>
              </Form>
            )}
          </Formik>
        </AdminFormLayout>
      ) : (
        <Loader />
      )}
    </AdminDashboardPage>
  );
};

export default CreateProject;
