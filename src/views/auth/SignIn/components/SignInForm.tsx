/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create Sign in form.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 23/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import { PasswordInput, TextInput } from 'components/InputFields';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { loginUserRequest } from 'services/auth';
// import { getProfileRequest } from 'services/account';

/* Local Imports */
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create sign In form to validate the credentials.
 *
 * @interface Props
 * @property {function} onSubmitSuccess - callback function on successful submission of sign in form
 */
export interface Props {
  onSubmitSuccess: (token: string, rememberMe: boolean) => void;
}

// ----------------------------------------------------------------------

/**
 * Sign In form to validate the credentials
 *
 * @component
 * @param {function} onSubmitSuccess - callback function on successful submission of sign in form
 * @returns {JSX.Element}
 */
const SignInForm = ({ onSubmitSuccess }: Props): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();

  /* Constant */
  const initialValues: any = {
    txtEmail: '',
    txtPassword: '',
    chkRememberMe: false
  };

  /* Functions */

  /**
   * Submit function to verify credentials for login
   * @param {object} values - input values of form
   * @returns {void}
   */
  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      console.log('tesing');
      const response = await loginUserRequest(
        values.txtEmail,
        values.txtPassword,
        values.chkRememberMe
      );
      console.log('res is', response);
      if (response?.status.response_code === 200 && response.token) {
        onSubmitSuccess(response.token, values.chkRememberMe);
      } else if (response?.status.response_code === 202) {
        showSnackbar(toastMessages.error.auth.invalidCredentials, 'error');
      } else if (response?.status.response_code === 203) {
        showSnackbar(toastMessages.error.auth.notRegistered, 'error');
      } else if (response?.status.response_code === 204) {
        showSnackbar(toastMessages.error.auth.notActive, 'error');
      } else if (response?.status.response_code === 208) {
        showSnackbar(toastMessages.error.auth.inActiveCompany, 'error');
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log('err is', error);
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtEmail: Yup.string()
      .email('Please enter the valid email address.')
      .required('Please enter your registered email address.'),
    txtPassword: Yup.string().required('Please enter your login password.')
  });

  /* Output */
  return (
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
          <Box mb={3}>
            <TextInput
              name="txtEmail"
              label="Email Address"
              placeholder="Enter email address"
              value={values.txtEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtEmail && errors.txtEmail)}
              helperText={String(touched.txtEmail && errors.txtEmail)}
            />
          </Box>
          <Box mb={2}>
            <PasswordInput
              name="txtPassword"
              label="Password"
              placeholder="Enter password"
              value={values.txtPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtPassword && errors.txtPassword)}
              helperText={String(touched.txtPassword && errors.txtPassword)}
            />
          </Box>
          <Box mb={2}>
            <FormGroup sx={styles.formGroup}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="chkRememberMe"
                    checked={values.chkRememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                }
                label="Remember me"
              />
              <Link
                component={RouterLink}
                variant="body2"
                underline="none"
                to={PAGE_ROOT.forgotPassword.absolutePath}
              >
                Forgot Password?
              </Link>
            </FormGroup>
          </Box>
          <Box>
            <LoadingButton
              fullWidth
              type="submit"
              size="large"
              variant="contained"
              loading={isSubmitting}
            >
              Sign In
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default memo(SignInForm);
