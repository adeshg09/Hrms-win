/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create client Page to add/edit clients.
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
import { SelectInput, TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages, countries } from 'constants/appConstant';
import { ClientFormValues, ClientModel } from 'models/company';
import {
  getClientByIdRequest,
  insertClientRequest,
  updateClientRequest
} from 'services/company/client';

// ----------------------------------------------------------------------

/* Constants */
const manageClientPath = PAGE_COMPANY_DASHBOARD.clients.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update client.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateClient = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtClientName: '',
    txtCountry: '',
    txtCompanyName: ''
  } as ClientFormValues);

  /* Functions */
  /**
   * function to get the client  by id with backend action
   * @param {string} clientId - id of client to fetch the detail
   * @returns {void}
   */
  const getClientById = async (clientId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getClientByIdRequest(Number(clientId));
      if (response && response.status.response_code === 200) {
        const clientData: ClientModel = response.client;
        setInitialValues({
          txtClientName: clientData.name,
          txtCountry: clientData.country,
          txtCompanyName: clientData.company_name || ''
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
   * Submit function to save/update client with backend action
   * @param {ClientFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: ClientFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        clientName: values.txtClientName.trim(),
        country: values.txtCountry.trim(),
        companyName: values.txtCompanyName.trim()
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateClientRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.clientUpdated,
            'success'
          );
          navigate(manageClientPath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.clientDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertClientRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.clientSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.clientDuplicate,
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
      getClientById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtClientName: Yup.string()
      .trim()
      .required('Please enter the client name.'),
    txtCountry: Yup.string().trim().required('Please select the country.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Clients">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Client' : 'Add Client'}
          subtitle={
            id
              ? 'Please update the details below to update client.'
              : 'Please fill the below details to create new client.'
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextInput
                        fullWidth
                        label="Client Name"
                        name="txtClientName"
                        value={values.txtClientName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtClientName && errors.txtClientName
                        )}
                        helperText={String(
                          touched.txtClientName && errors.txtClientName
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Country"
                        name="txtCountry"
                        value={values.txtCountry}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtCountry && errors.txtCountry)}
                        helperText={String(
                          touched.txtCountry && errors.txtCountry
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {countries.map((option, i) => (
                          <MenuItem key={i} value={option.alpha2Code}>
                            {option.country}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Company Name"
                        name="txtCompanyName"
                        value={values.txtCompanyName}
                        inputProps={{ maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtCompanyName && errors.txtCompanyName
                        )}
                        helperText={String(
                          touched.txtCompanyName && errors.txtCompanyName
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
                    onClick={() => navigate(manageClientPath)}
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

export default CreateClient;
