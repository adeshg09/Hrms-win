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
  getCompanySubModuleByIdRequest,
  insertCompanySubModuleRequest,
  updateCompanySubModuleRequest
} from 'services/master/companySubModule';
import {
  CompanySubModuleFormValues,
  SubModuleModel
} from 'models/master/CompanySubModule';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const manageSubModulePath = PAGE_ADMIN_DASHBOARD.companySubModules.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update sub module.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateSubModule = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtSubModuleName: '',
    txtDisplayName: '',
    txtSummary: ''
  } as CompanySubModuleFormValues);

  /* Functions */
  /**
   * function to get the sub module by id with backend action
   * @param {string} subModuleId - id of sub module to fetch the detail
   * @returns {void}
   */
  const getSubModuleById = async (subModuleId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanySubModuleByIdRequest(
        Number(subModuleId)
      );
      if (response && response.status.response_code === 200) {
        const moduleData: SubModuleModel = response.company_sub_module;
        setInitialValues({
          txtSubModuleName: moduleData.name,
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
   * Submit function to save/update sub module with backend action
   * @param {SubModuleFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: CompanySubModuleFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        // name: values.txtSubModuleName.trim(),
        displayName: values.txtDisplayName.trim(),
        summary: values.txtSummary.trim()
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateCompanySubModuleRequest(
          Number(id),
          requestData
        );
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.SubModuleUpdated,
            'success'
          );
          navigate(manageSubModulePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.subModuleDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        console.log('req data is', requestData);
        const response = await insertCompanySubModuleRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.SubModuleSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.subModuleDuplicate,
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
      getSubModuleById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    // txtSubModuleName: Yup.string()
    //   .trim()
    //   .matches(
    //     /^[a-zA-Z0-9 ]+$/,
    //     'Please enter only alphabetics and/or numbers.'
    //   ),
    txtDisplayName: Yup.string()
      .trim()
      .required('Please enter the display name.'),
    txtSummary: Yup.string().trim().required('Please enter the summary.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Sub Modules">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Sub Module' : 'Add Sub Module'}
          subtitle={
            id
              ? 'Please update the details below to update sub module.'
              : 'Please fill the below details to create new sub module.'
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
                  {/* <Box mb={2}>
                    <TextInput
                      fullWidth
                      label="Sub Module Name"
                      name="txtSubModuleName"
                      value={values.txtSubModuleName}
                      inputProps={{ maxLength: 50 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.txtSubModuleName && errors.txtSubModuleName
                      )}
                      helperText={String(
                        touched.txtSubModuleName && errors.txtSubModuleName
                      )}
                    />
                  </Box> */}
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
                    onClick={() => navigate(manageSubModulePath)}
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

export default CreateSubModule;
