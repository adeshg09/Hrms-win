/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create designation Page to add/edit designations.
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
import { Button, CardActions, CardContent, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { DesignationFormValues } from 'models/company';
import {
  getDesignationByIdRequest,
  insertDesignationRequest,
  updateDesignationRequest
} from 'services/company/designation';

// ----------------------------------------------------------------------

/* Constants */
const manageDesignationPath = PAGE_COMPANY_DASHBOARD.designations.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update designation.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateDesignation = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtDesignationName: ''
  } as DesignationFormValues);

  /* Functions */
  /**
   * function to get the designation by id with backend action
   * @param {string} designationId - id of designation to fetch the detail
   * @returns {void}
   */
  const getDesignationById = async (designationId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getDesignationByIdRequest(Number(designationId));
      if (response && response.status.response_code === 200) {
        const { designation } = response;
        setInitialValues({ txtDesignationName: designation.name });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update designation with backend action
   * @param {DesignationFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: DesignationFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        designationName: values.txtDesignationName.trim()
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateDesignationRequest(
          Number(id),
          requestData
        );
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.designationUpdated,
            'success'
          );
          navigate(manageDesignationPath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.designationDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertDesignationRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.designationSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.designationDuplicate,
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
      getDesignationById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtDesignationName: Yup.string()
      .trim()
      .required('Please enter the designation name.')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Designations">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Designation' : 'Add Designation'}
          subtitle={
            id
              ? 'Please update the details below to update designation.'
              : 'Please fill the below details to create new designation.'
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
                  <TextInput
                    fullWidth
                    label="Designation Name"
                    name="txtDesignationName"
                    value={values.txtDesignationName}
                    inputProps={{ maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      touched.txtDesignationName && errors.txtDesignationName
                    )}
                    helperText={String(
                      touched.txtDesignationName && errors.txtDesignationName
                    )}
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
                    onClick={() => navigate(manageDesignationPath)}
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

export default CreateDesignation;
