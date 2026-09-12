/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create role Page to add/edit roles.
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
  Grid,
  MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { AutoCompleteInput, TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { RoleFormValues } from 'models/company';
import {
  CompanySubModuleModel
  // SubModuleModel
} from 'models/master/CompanySubModule';
import {
  getRoleByIdRequest,
  insertRoleRequest,
  updateRoleRequest
} from 'services/company/role';
import { getCompanyProfileSubModulesRequest } from 'services/master/companySubModule';

/* Local Imports */

// import adminStyle from '../../company.style';

// ----------------------------------------------------------------------

/* Constants */
const manageRolePath = PAGE_COMPANY_DASHBOARD.roles.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update role.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateRole = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(!id);
  const [subModules, setSubModules] = useState<Array<CompanySubModuleModel>>(
    []
  );
  const [initialValues, setInitialValues] = useState({
    txtRoleName: '',
    txtDescription: '',
    ddlSubModule: []
  } as RoleFormValues);

  /* Functions */
  /**
   * function to get the role by id with backend action
   * @param {string} roleId - id of role to fetch the detail
   * @returns {void}
   */
  const getRoleById = async (roleId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getRoleByIdRequest(Number(roleId));
      if (response && response.status.response_code === 200) {
        const { role } = response;
        console.log('isPublic value res:', role.is_public, isPublic);
        setIsPublic(role.is_public);
        console.log('role name is', role.name);
        setInitialValues({
          txtRoleName: role.name,
          txtDescription: role.description.split('.')[0],
          ddlSubModule: role?.subModules?.map((item: any) => item.id)
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
   * function to get the role by id with backend action
   * @param {string} roleId - id of role to fetch the detail
   * @returns {void}
   */
  const getCompanySubModules = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanyProfileSubModulesRequest();
      if (response && response.status.response_code === 200) {
        setSubModules(response?.companySubModules);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update role with backend action
   * @param {RoleFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: RoleFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        roleName: values.txtRoleName.trim(),
        description: values.txtDescription.trim(),
        subModuleIds: JSON.stringify(values.ddlSubModule)
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateRoleRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.roleUpdated,
            'success'
          );
          navigate(manageRolePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.roleDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertRoleRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.roleSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.roleDuplicate,
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
    console.log('isPublic value:', isPublic);
    console.log('user is', user);
    getCompanySubModules();
    if (id) {
      getRoleById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtRoleName: Yup.string()
      .trim()
      .required('Please enter the role name.')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed'),
    txtDescription: Yup.string()
      .trim()
      .required('Please enter the role description.')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed'),
    ddlSubModule: Yup.array()
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Roles">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Role' : 'Add Role'}
          subtitle={
            id
              ? 'Please update the details below to update role.'
              : 'Please fill the below details to create new role.'
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
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextInput
                        fullWidth
                        label="Role Name"
                        name="txtRoleName"
                        value={values.txtRoleName}
                        inputProps={{
                          maxLength: 50
                        }}
                        disabled={!isPublic}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtRoleName && errors.txtRoleName
                        )}
                        helperText={String(
                          touched.txtRoleName && errors.txtRoleName
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                      <TextInput
                        fullWidth
                        label="Role Description"
                        name="txtDescription"
                        value={values.txtDescription}
                        disabled={!isPublic}
                        inputProps={{
                          maxLength: 50
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtDescription && errors.txtDescription
                        )}
                        helperText={String(
                          touched.txtDescription && errors.txtDescription
                        )}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <AutoCompleteInput
                        multiple
                        label="Select Sub Module"
                        name="ddlSubModule"
                        value={values.ddlSubModule}
                        data={
                          subModules?.map(
                            (val: CompanySubModuleModel) => val.sub_module_id
                          ) || []
                        }
                        originalData={subModules}
                        itemId="sub_module_id"
                        itemName="sub_module_display_name"
                        placeholder="Search Sub Module"
                        limitTags={2}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {subModules?.find(
                              (val: CompanySubModuleModel) =>
                                val.sub_module_id === option
                            )?.sub_module_display_name || ''}
                          </MenuItem>
                        )}
                        onChange={(e: any) => {
                          setFieldValue('ddlSubModule', e);
                        }}
                        error={Boolean(
                          touched.ddlSubModule && errors.ddlSubModule
                        )}
                        helperText={String(
                          touched.ddlSubModule && errors.ddlSubModule
                        )}
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
                    onClick={() => navigate(manageRolePath)}
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

export default CreateRole;
