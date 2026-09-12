/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create coupon code Page to add/edit coupon codes.
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
  FormControlLabel,
  Grid,
  Switch,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import { AdminFormLayout } from 'components/CardLayout';
import { CustomField, TextInput } from 'components/InputFields';
import QuillEditor from 'components/QuillEditor';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  getCouponCodeByIdRequest,
  insertCouponCodeRequest,
  updateCouponCodeRequest
} from 'services/master/couponCode';
import { CouponCodeFormValues, CouponCodeModel } from 'models/master';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const manageCouponCodePath = PAGE_ADMIN_DASHBOARD.couponCodes.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update coupon code.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateCouponCode = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtCode: '',
    txtDiscount: '',
    chkIsPercentage: false,
    txtMaxDiscount: '',
    txtSummary: '',
    txtDescription: '',
    chkIsActive: true
  } as CouponCodeFormValues);

  /* Functions */
  /**
   * function to get the coupon code by id with backend action
   * @param {string} couponCodeId - id of coupon code to fetch the detail
   * @returns {void}
   */
  const getCouponCodeById = async (couponCodeId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCouponCodeByIdRequest(Number(couponCodeId));
      if (response && response.status.response_code === 200) {
        const couponCodeData: CouponCodeModel = response.coupon_code;
        setInitialValues({
          txtCode: couponCodeData.code,
          txtDiscount: couponCodeData.discount,
          chkIsPercentage: couponCodeData.is_percentage,
          txtMaxDiscount: couponCodeData.max_discount || '',
          txtSummary: couponCodeData.summary || '',
          txtDescription: couponCodeData.description || '',
          chkIsActive: couponCodeData.is_active
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
   * Submit function to save/update coupon code with backend action
   * @param {CouponCodeFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: CouponCodeFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        code: values.txtCode.trim(),
        discount: values.txtDiscount,
        isPercentage: values.chkIsPercentage,
        maxDiscount:
          values.txtMaxDiscount !== '' ? values.txtMaxDiscount : null,
        summary: values.txtSummary.trim(),
        description: values.txtDescription.trim(),
        isActive: values.chkIsActive
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateCouponCodeRequest(Number(id), requestData);
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.couponCodeUpdated,
            'success'
          );
          navigate(manageCouponCodePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.couponCodeDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertCouponCodeRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.couponCodeSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.couponCodeDuplicate,
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
      getCouponCodeById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtCode: Yup.string().trim().required('Please enter the coupon code.'),
    txtDiscount: Yup.number()
      .min(0, 'Please enter valid discount.')
      .required('Please enter the discount.'),
    txtMaxDiscount: Yup.number().min(0, 'Please enter valid max discount.')
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Coupon Codes">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Coupon Code' : 'Add Coupon Code'}
          subtitle={
            id
              ? 'Please update the details below to update coupon code.'
              : 'Please fill the below details to create new coupon code.'
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
                        label="Code"
                        name="txtCode"
                        value={values.txtCode}
                        inputProps={{ maxLength: 10 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtCode && errors.txtCode)}
                        helperText={String(touched.txtCode && errors.txtCode)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Discount"
                        name="txtDiscount"
                        type="number"
                        value={values.txtDiscount}
                        inputProps={{ min: 0 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtDiscount && errors.txtDiscount
                        )}
                        helperText={String(
                          touched.txtDiscount && errors.txtDiscount
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      display="flex"
                      alignItems="center"
                      xs={12}
                      sm={6}
                      md={6}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            name="chkIsPercentage"
                            checked={values.chkIsPercentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label={
                          <Typography variant="body2" ml={2}>
                            Is Percentage
                          </Typography>
                        }
                        sx={adminStyle.formControlLabel}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Max Discount"
                        name="txtMaxDiscount"
                        type="number"
                        value={values.txtMaxDiscount}
                        inputProps={{ min: 0 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtMaxDiscount && errors.txtMaxDiscount
                        )}
                        helperText={String(
                          touched.txtMaxDiscount && errors.txtMaxDiscount
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
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
                        helperText={String(
                          touched.txtSummary && errors.txtSummary
                        )}
                        sx={adminStyle.textMultilineInputStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <CustomField name="txtDescription" label="Description">
                        <QuillEditor
                          value={values.txtDescription}
                          placeholder="Description...."
                          setFieldValue={(e) => {
                            setFieldValue('txtDescription', e);
                          }}
                        />
                      </CustomField>
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
                    onClick={() => navigate(manageCouponCodePath)}
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

export default CreateCouponCode;
