/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create plan price page to add/edit plan prices.
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
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { SelectInput, TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  PlanDurationModel,
  PlanModel,
  PlanPriceFormValues,
  PlanPriceModel
} from 'models/master';
import { getPlanDurationsRequest } from 'services/master/planDuration';
import { getPlansRequest } from 'services/master/plan';
import {
  getPlanPriceByIdRequest,
  insertPlanPriceRequest,
  updatePlanPriceRequest
} from 'services/master/planPrice';

// ----------------------------------------------------------------------

/* Constants */
const managePlanPricePath = PAGE_ADMIN_DASHBOARD.planPrice.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update plan price.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreatePlanPrice = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [planDurations, setPlanDurations] = useState<Array<PlanDurationModel>>(
    []
  );
  const [plans, setPlans] = useState<Array<PlanModel>>([]);
  const [initialValues, setInitialValues] = useState<any>({
    ddlPlan: '',
    ddlPlanDuration: '',
    txtPlanPrice: ''
  } as PlanPriceFormValues);

  /* Functions */
  /**
   * function to get the all plan durations with backend action
   * @returns {void}
   */
  const getPlanDurations = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlanDurationsRequest();
      if (response?.status.response_code === 200) {
        setPlanDurations(response.plan_durations || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get the all plans with backend action
   * @returns {void}
   */
  const getPlans = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlansRequest();
      if (response?.status.response_code === 200) {
        setPlans(response.plans || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get the plan duration by id with backend action
   * @param {string} planPriceId - id of plan duration to fetch the detail
   * @returns {void}
   */
  const getPlanPriceById = async (planPriceId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlanPriceByIdRequest(Number(planPriceId));
      if (response && response.status.response_code === 200) {
        const planPriceData: PlanPriceModel = response.plan_price;
        setInitialValues({
          ddlPlan: planPriceData.plan.id,
          ddlPlanDuration: planPriceData.plan_duration.id,
          txtPlanPrice: planPriceData.price
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
   * Submit function to save/update plan price with backend action
   * @param {PlanPriceFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: PlanPriceFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        planId: values.ddlPlan,
        planDurationId: values.ddlPlanDuration,
        price: values.txtPlanPrice
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updatePlanPriceRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.planPriceUpdated,
            'success'
          );
          navigate(managePlanPricePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planPriceDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertPlanPriceRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.planPriceSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planPriceDuplicate,
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
    getPlanDurations();
    getPlans();
    if (id) {
      getPlanPriceById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    ddlPlan: Yup.string().trim().required('Please select a plan.'),
    ddlPlanDuration: Yup.string()
      .trim()
      .required('Please select a plan duration.'),
    txtPlanPrice: Yup.number()
      .required('Please enter the plan price.')
      .min(0, 'Please enter valid plan price.')
      .typeError('Please enter valid plan price.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plan Price">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Plan Price' : 'Add Plan Price'}
          subtitle={
            id
              ? 'Please update the details below to update plan price.'
              : 'Please fill the below details to create new plan price.'
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
              values
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      <SelectInput
                        fullWidth
                        label="Plan"
                        name="ddlPlan"
                        placeholder="Please select the plan."
                        value={values.ddlPlan}
                        variant="outlined"
                        disabled={!!id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ minHeight: 50 }}
                        error={Boolean(touched.ddlPlan && errors.ddlPlan)}
                        helperText={String(touched.ddlPlan && errors.ddlPlan)}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {plans.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <SelectInput
                        fullWidth
                        label="Plan Duration"
                        name="ddlPlanDuration"
                        placeholder="Please select the plan duration."
                        value={values.ddlPlanDuration}
                        variant="outlined"
                        disabled={!!id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ minHeight: 50 }}
                        error={Boolean(
                          touched.ddlPlanDuration && errors.ddlPlanDuration
                        )}
                        helperText={String(
                          touched.ddlPlanDuration && errors.ddlPlanDuration
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {planDurations.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.no_of_month}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        label="Plan Price"
                        name="txtPlanPrice"
                        type="number"
                        value={values.txtPlanPrice}
                        inputProps={{ min: 0 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtPlanPrice && errors.txtPlanPrice
                        )}
                        helperText={String(
                          touched.txtPlanPrice && errors.txtPlanPrice
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
                    onClick={() => navigate(managePlanPricePath)}
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

export default CreatePlanPrice;
