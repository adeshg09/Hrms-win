/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create user Page to add/edit users.
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
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { AutoCompleteInput, TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  RoleModel,
  ShortRoleModel,
  UserFormValues,
  UserProfileModel
} from 'models/master';
import {
  getUserByIdRequest,
  registerUserRequest,
  updateUserRequest
} from 'services/master/user';
import { getRolesRequest } from 'services/master/role';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const manageUserPath = PAGE_ADMIN_DASHBOARD.users.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update user.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateUser = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();
  // const fileUploadRef = useRef();

  /* States */
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Array<RoleModel>>([]);
  const [editableUser, setEditableUser] = useState<
    UserProfileModel | undefined
  >(undefined);
  const [initialValues, setInitialValues] = useState({
    txtFirstName: '',
    txtLastName: '',
    txtEmail: '',
    txtPassword: '',
    ddlRoles: [],
    chkIsActive: true
  } as UserFormValues);

  /* Functions */
  /**
   * function to get all the roles with backend action
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    try {
      const response = await getRolesRequest();
      if (response && response.status.response_code === 200) {
        setRoles(response.roles);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get the user by id with backend action
   * @param {string} userId - id of user to fetch the detail
   * @returns {void}
   */
  const getUserById = async (userId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUserByIdRequest(Number(userId));
      if (response && response.status.response_code === 200) {
        const userData: UserProfileModel = response.user;
        setEditableUser({ ...userData });
        setInitialValues({
          txtFirstName: userData.first_name,
          txtLastName: userData.last_name,
          txtEmail: userData.email,
          ddlRoles: userData.roles?.map((item) => item.id),
          chkIsActive: userData.is_active
        });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: UserFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        firstName: values.txtFirstName.trim(),
        lastName: values.txtLastName.trim(),
        email: values.txtEmail.trim(),
        password: values.txtPassword,
        roleIds: JSON.stringify(values.ddlRoles || []),
        isActive: values.chkIsActive
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateUserRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.userUpdated,
            'success'
          );
          navigate(manageUserPath);
        } else if (response?.status.response_code === 205) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await registerUserRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.userSaved,
            'success'
          );
        } else if (response?.status.response_code === 205) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
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

  /* Side-Effects */
  useEffect(() => {
    handleGetRoles();
    if (id) {
      getUserById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtFirstName: Yup.string()
      .trim()
      .required('Please enter the first name.')
      .matches(
        /^[a-zA-Z0-9 ]+$/,
        'Please enter only alphabetics and/or numbers.'
      ),
    txtLastName: Yup.string()
      .trim()
      .required('Please enter the last name.')
      .matches(
        /^[a-zA-Z0-9 ]+$/,
        'Please enter only alphabetics and/or numbers.'
      ),
    txtEmail: Yup.string()
      .trim()
      .email('Please enter the valid email address.')
      .required('Please enter the email address.'),
    txtPassword: !id
      ? Yup.string()
          .min(7, 'Password should be minimum 7 characters.')
          .max(100, 'Password should be maximum 100 characters.')
          .required('Please enter the password.')
      : Yup.string(),
    ddlRoles: Yup.array()
      .min(1, 'Please select the role.')
      .required('Please select the role.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Users">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit User' : 'Add User'}
          subtitle={
            id
              ? 'Please update the details below to update user.'
              : 'Please fill the below details to create new user.'
          }
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="First Name"
                        name="txtFirstName"
                        value={values.txtFirstName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtFirstName && errors.txtFirstName
                        )}
                        helperText={String(
                          touched.txtFirstName && errors.txtFirstName
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Last Name"
                        name="txtLastName"
                        value={values.txtLastName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtLastName && errors.txtLastName
                        )}
                        helperText={String(
                          touched.txtLastName && errors.txtLastName
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Email"
                        name="txtEmail"
                        type="email"
                        value={values.txtEmail}
                        inputProps={{ maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtEmail && errors.txtEmail)}
                        helperText={String(touched.txtEmail && errors.txtEmail)}
                      />
                    </Grid>
                    {!id && (
                      <Grid item xs={12} sm={6} md={6}>
                        <TextInput
                          fullWidth
                          label="Password"
                          name="txtPassword"
                          type="password"
                          value={values.txtPassword}
                          inputProps={{ maxLength: 100 }}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.txtPassword && errors.txtPassword
                          )}
                          helperText={String(
                            touched.txtPassword && errors.txtPassword
                          )}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <AutoCompleteInput
                        multiple
                        label="Select Role"
                        name="ddlRoles"
                        value={values.ddlRoles}
                        data={roles?.map((val: ShortRoleModel) => val.id) || []}
                        originalData={roles}
                        itemId="id"
                        itemName="name"
                        placeholder="search role"
                        limitTags={2}
                        disabled={
                          editableUser &&
                          editableUser.roles?.find(
                            (val: any) => val.name?.toLowerCase() === 'admin'
                          ) &&
                          editableUser.id === user.id
                        }
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {roles?.find(
                              (val: ShortRoleModel) => val.id === option
                            )?.name || ''}
                          </MenuItem>
                        )}
                        onChange={(e: any) => {
                          setFieldValue('ddlRoles', e);
                        }}
                        // onBlur={handleBlur}
                        error={Boolean(touched.ddlRoles && errors.ddlRoles)}
                        helperText={String(touched.ddlRoles && errors.ddlRoles)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      sx={!id ? { paddingTop: '52px !important' } : {}}
                    >
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
                    onClick={() => navigate(manageUserPath)}
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

export default CreateUser;
