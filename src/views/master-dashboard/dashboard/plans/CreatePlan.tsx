/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create plan page to add/edit plans.
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
import {
  AutoCompleteInput,
  CustomField,
  TextInput
} from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import QuillEditor from 'components/QuillEditor';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { ModuleModel, PlanFormValues, PlanModel } from 'models/master';
import {
  getPlanByIdRequest,
  insertPlanRequest,
  updatePlanRequest
} from 'services/master/plan';
import { getModulesRequest } from 'services/master/module';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const managePlanPath = PAGE_ADMIN_DASHBOARD.plans.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update plan.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreatePlan = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Array<ModuleModel>>([]);
  const [initialValues, setInitialValues] = useState({
    txtName: '',
    txtSummary: '',
    txtDescription: '',
    ddlModule: [],
    txtActualPrice: '',
    txtVisiblePrice: '',
    chkIsVisible: false,
    chkIsActive: true
  } as PlanFormValues);

  /* Functions */
  /**
   * function to get the all modules with backend action
   * @returns {void}
   */
  const getModules = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getModulesRequest();
      if (response?.status.response_code === 200) {
        setModules(response.modules || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };
  /**
   * function to get the plan by id with backend action
   * @param {string} planId - id of plan to fetch the detail
   * @returns {void}
   */
  const getPlanById = async (planId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getPlanByIdRequest(Number(planId));
      if (response && response.status.response_code === 200) {
        const planData: PlanModel = response.plan;
        setInitialValues({
          txtName: planData.name,
          txtSummary: planData.summary,
          txtDescription: planData.description,
          ddlModule: planData.modules?.map((item) => item.id),
          txtActualPrice: planData.actual_price || '',
          txtVisiblePrice: planData.visible_price,
          chkIsActive: planData.is_active,
          chkIsVisible: planData.is_visible
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
   * Submit function to save/update plan with backend action
   * @param {PlanFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: PlanFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        name: values.txtName.trim(),
        summary: values.txtSummary.trim(),
        description: values.txtDescription,
        moduleIds: JSON.stringify(values.ddlModule || []),
        actualPrice: values.txtActualPrice,
        visiblePrice: values.txtVisiblePrice,
        isVisible: values.chkIsVisible,
        isActive: values.chkIsActive
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updatePlanRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.planUpdated,
            'success'
          );
          navigate(managePlanPath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertPlanRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.planSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.planDuplicate,
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
    getModules();
    if (id) {
      getPlanById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtName: Yup.string().trim().required('Please enter the name.'),
    txtSummary: Yup.string().trim().required('Please enter the summary.'),
    ddlModule: Yup.array()
      .min(1, 'Please select at least one module.')
      .required('Please select the module.'),
    txtActualPrice: Yup.number()
      .required('Please enter the actual price.')
      .min(0, 'Please enter valid price.')
      .typeError('Please enter valid price.'),
    txtVisiblePrice: Yup.number()
      .required('Please enter the discounted price.')
      .min(0, 'Please enter valid price.')
      .typeError('Please enter valid price')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Plans">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Plan' : 'Add Plan'}
          subtitle={
            id
              ? 'Please update the details below to update plan.'
              : 'Please fill the below details to create new plan.'
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
              setFieldValue,
              touched,
              values
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        label="Plan Name"
                        name="txtName"
                        value={values.txtName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtName && errors.txtName)}
                        helperText={String(touched.txtName && errors.txtName)}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        multiline
                        rows={2}
                        label="Plan Summary"
                        name="txtSummary"
                        value={values.txtSummary}
                        inputProps={{ maxLength: 500 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtSummary && errors.txtSummary)}
                        helperText={String(
                          touched.txtSummary && errors.txtSummary
                        )}
                        sx={adminStyle.textMultilineInputStyle}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
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
                          placeholder="Enter the Body"
                        />
                      </CustomField>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <AutoCompleteInput
                        multiple
                        label="Select Module"
                        name="ddlModule"
                        value={values.ddlModule}
                        data={modules?.map((val: ModuleModel) => val.id) || []}
                        originalData={modules}
                        itemId="id"
                        itemName="display_name"
                        placeholder="Search Module"
                        limitTags={2}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {modules?.find(
                              (val: ModuleModel) => val.id === option
                            )?.display_name || ''}
                          </MenuItem>
                        )}
                        onChange={(e: any) => {
                          setFieldValue('ddlModule', e);
                        }}
                        error={Boolean(touched.ddlModule && errors.ddlModule)}
                        helperText={String(
                          touched.ddlModule && errors.ddlModule
                        )}
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextInput
                        fullWidth
                        label="Actual Price"
                        name="txtActualPrice"
                        type="number"
                        value={values.txtActualPrice}
                        inputProps={{ min: 0 }}
                        onChange={(e) => {
                          setFieldValue('txtVisiblePrice', e.target.value);
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtActualPrice && errors.txtActualPrice
                        )}
                        helperText={String(
                          touched.txtActualPrice && errors.txtActualPrice
                        )}
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextInput
                        fullWidth
                        label="Discounted Price"
                        name="txtVisiblePrice"
                        type="number"
                        value={values.txtVisiblePrice}
                        inputProps={{ min: 0 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtVisiblePrice && errors.txtVisiblePrice
                        )}
                        helperText={String(
                          touched.txtVisiblePrice && errors.txtVisiblePrice
                        )}
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="chkIsVisible"
                            checked={values.chkIsVisible}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label={
                          <Typography variant="body2" ml={2}>
                            Is Visible
                          </Typography>
                        }
                        sx={adminStyle.formControlLabel}
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
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
                    onClick={() => navigate(managePlanPath)}
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

export default CreatePlan;
