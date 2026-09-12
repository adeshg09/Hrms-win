/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create plan duration Page to add/edit plan durations.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 20/Mar/2023
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
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { PlanDurationFormValues, PlanDurationModel } from 'models/master';
import {
  getPlanDurationByIdRequest,
  insertPlanDurationRequest,
  updatePlanDurationRequest
} from 'services/master/planDuration';

// ----------------------------------------------------------------------

/* Constants */
const managePlanDurationPath = PAGE_ADMIN_DASHBOARD.planDuration.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update plan duration.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreatePlanDuration = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    numOfMonths: ''
  } as PlanDurationFormValues);

  /* Functions */
  /**
   * function to get the plan duration by id with backend action
   * @param {string} planDurationId - id of plan duration to fetch the detail
   * @returns {void}
   */
  const getPlanDurationById = async (planDurationId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlanDurationByIdRequest(Number(planDurationId));
      if (response && response.status.response_code === 200) {
        const planDurationData: PlanDurationModel = response.plan_duration;
        setInitialValues({ numOfMonths: planDurationData.no_of_month });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update plan duration with backend action
   * @param {PlanDurationFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: PlanDurationFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        noOfMonth: values.numOfMonths
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updatePlanDurationRequest(
          Number(id),
          requestData
        );
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.planDurationUpdated,
            'success'
          );
          navigate(managePlanDurationPath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planDurationDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertPlanDurationRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.planDurationSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planDurationDuplicate,
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
      getPlanDurationById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    numOfMonths: Yup.number()
      .nullable()
      .min(1, 'Please enter min 1 month')
      .max(120, 'Please enter max 120 month')
      .required('Please enter the number of months')
      .positive('Please enter valid number of months')
      .typeError('Please enter valid number of months')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plan Durations">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Plan Duration' : 'Add Plan Duration'}
          subtitle={
            id
              ? 'Please update the details below to update plan duration.'
              : 'Please fill the below details to create new plan duration.'
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
                    label="Number of Months"
                    name="numOfMonths"
                    value={values.numOfMonths}
                    type="number"
                    inputProps={{ min: 1, max: 120 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.numOfMonths && errors.numOfMonths)}
                    helperText={String(
                      touched.numOfMonths && errors.numOfMonths
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
                    onClick={() => navigate(managePlanDurationPath)}
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

export default CreatePlanDuration;
