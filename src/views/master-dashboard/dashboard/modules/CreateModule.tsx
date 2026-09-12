/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create module Page to add/edit modules.
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
import { Box, Button, CardActions, CardContent, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  getModuleByIdRequest,
  insertModuleRequest,
  updateModuleRequest
} from 'services/master/module';
import { ModuleFormValues, ModuleModel } from 'models/master';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const manageModulePath = PAGE_ADMIN_DASHBOARD.modules.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update module.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateModule = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtModuleName: '',
    txtDisplayName: '',
    txtSummary: ''
  } as ModuleFormValues);

  /* Functions */
  /**
   * function to get the module by id with backend action
   * @param {string} moduleId - id of module to fetch the detail
   * @returns {void}
   */
  const getModuleById = async (moduleId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getModuleByIdRequest(Number(moduleId));
      if (response && response.status.response_code === 200) {
        const moduleData: ModuleModel = response.module;
        setInitialValues({
          txtModuleName: moduleData.name,
          txtDisplayName: moduleData.display_name || '',
          txtSummary: moduleData.summary || ''
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
   * Submit function to save/update module with backend action
   * @param {ModuleFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: ModuleFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        name: values.txtModuleName.trim(),
        displayName: values.txtDisplayName.trim(),
        summary: values.txtSummary.trim()
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateModuleRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.moduleUpdated,
            'success'
          );
          navigate(manageModulePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.moduleDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertModuleRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.moduleSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.moduleDuplicate,
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
    if (id) {
      getModuleById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtModuleName: Yup.string()
      .trim()
      .required('Please enter the module name.')
      .matches(
        /^[a-zA-Z0-9 ]+$/,
        'Please enter only alphabetics and/or numbers.'
      ),
    txtDisplayName: Yup.string()
      .trim()
      .required('Please enter the display name.'),
    txtSummary: Yup.string().trim().required('Please enter the summary.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Modules">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Module' : 'Add Module'}
          subtitle={
            id
              ? 'Please update the details below to update module.'
              : 'Please fill the below details to create new module.'
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
              values
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Box mb={2}>
                    <TextInput
                      fullWidth
                      label="Module Name"
                      name="txtModuleName"
                      value={values.txtModuleName}
                      inputProps={{ maxLength: 50 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.txtModuleName && errors.txtModuleName
                      )}
                      helperText={String(
                        touched.txtModuleName && errors.txtModuleName
                      )}
                    />
                  </Box>
                  <Box mb={2}>
                    <TextInput
                      fullWidth
                      label="Display Name"
                      name="txtDisplayName"
                      value={values.txtDisplayName}
                      inputProps={{ maxLength: 50 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.txtDisplayName && errors.txtDisplayName
                      )}
                      helperText={String(
                        touched.txtDisplayName && errors.txtDisplayName
                      )}
                    />
                  </Box>
                  <TextInput
                    fullWidth
                    multiline
                    label="Summary"
                    name="txtSummary"
                    value={values.txtSummary}
                    rows={2}
                    inputProps={{ maxLength: 500 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.txtSummary && errors.txtSummary)}
                    helperText={String(touched.txtSummary && errors.txtSummary)}
                    sx={adminStyle.textMultilineInputStyle}
                  />
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
                    onClick={() => navigate(manageModulePath)}
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

export default CreateModule;
