/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create company Page to add/edit companies.
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
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import {
  Box,
  Button,
  Stepper,
  Typography,
  Step,
  StepLabel,
  CardActions,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  MenuItem,
  FormHelperText,
  // Select,
  // FormControl,
  // InputLabel,
  // OutlinedInput,
  Checkbox
  // ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'react-dropdown-tree-select/dist/styles.css';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import {
  AutoCompleteInput,
  CustomField,
  SelectInput,
  TextInput
} from 'components/InputFields';
// import MultiLevelSelectInput, {
// getAllSelectedIds,
// TreeNode,
// updateNodeSelectionState
// } from 'components/InputFields/MultiLevelSelectInput';
import { AdminDashboardPage } from 'components/Page';
import { AdminFormLayout } from 'components/CardLayout';
import Loader from 'components/Loader';
import { UploadSingleImage } from 'components/InputFields/upload';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { getDomainName } from 'helper/commonHelper';
import { toastMessages, countries } from 'constants/appConstant';
import {
  AddCompanyFormValues,
  ShortCompanyModuleModel,
  ShortPlanDurationModel
  // ShortPlanModel
} from 'models/master';
// import { getPlanDurationsRequest } from 'services/master/planDuration';
// import { getActivePlansRequest } from 'services/master/plan';
import { insertCompanyRequest } from 'services/master/company';
import {
  // getCompanyModulesGroupedByParentRequest,
  getCompanyModulesRequest
} from 'services/master/companyModule';
/* Local Imports */

import adminStyle from '../../master.style';
// import { displayName } from 'react-quill';
// import Chip from 'theme/overrides/Chip';

// ----------------------------------------------------------------------

/* Constants */
const manageCompanyPath = PAGE_ADMIN_DASHBOARD.companies.absolutePath;

// ----------------------------------------------------------------------

const steps = ['Company Details', 'User Details', 'Plan Details'];

const CreateCompany = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [states, setStates] = useState<string[] | []>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [plans, setPlans] = useState<Array<ShortPlanModel>>([]);
  // const [planDuration, setPlanDuration] = useState<
  //   Array<ShortPlanDurationModel>
  // >([]);

  const PlanDuration = [
    {
      id: 1,
      no_of_month: 1
    },
    {
      id: 2,
      no_of_month: 3
    },
    {
      id: 3,
      no_of_month: 6
    }
  ];

  const [modules, setModules] = useState<ShortCompanyModuleModel[]>([
    {
      id: 0,
      display_name: ''
    }
  ]);

  /* Constants */
  const initialValues = {
    departmentStructure: [],
    txtName: '',
    txtDisplayName: '',
    txtAddress: '',
    txtCountry: '',
    txtState: '',
    txtCity: '',
    txtPinCode: '',
    txtDomainName: '',
    fileLogo: '',
    chkIsActive: true,
    txtFirstName: '',
    txtLastName: '',
    txtRegisteredEmail: '',
    txtPassword: '',
    txtConfirmPassword: '',
    chkIsUserActive: true,
    ddlPlan: '',
    ddlPlanDuration: '',
    ddlModule: [],
    txtUserCount: '',
    txtStartDate: '',
    txtEndDate: '',
    ddlStartMonth: ''
  } as AddCompanyFormValues;

  const isLastStep = activeStep === steps.length - 1;

  /* Functions */
  /**
   * function to go back
   * @return {void}
   */
  const handleBack = (): void => {
    if (activeStep === 0) {
      navigate(manageCompanyPath);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  /**
   * function to handle country change
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  /**
   * function to get all the plans with backend action
   * @returns {void}
   */
  // const handleGetPlans = async (): Promise<any> => {
  //   try {
  //     const response = await getActivePlansRequest();
  //     if (response && response.status.response_code === 200) {
  //       setPlans(response.plans);
  //     } else {
  //       showSnackbar(toastMessages.error.common, 'error');
  //     }
  //   } catch (error) {
  //     showSnackbar(toastMessages.error.common, 'error');
  //   }
  // };

  /**
   * function to get all the plan duration with backend action
   * @returns {void}
   */
  // const handleGetPlanDurations = async (): Promise<void> => {
  //   setLoading(true);
  //   try {
  //     const response = await getPlanDurationsRequest();
  //     if (response?.status.response_code === 200) {
  //       setPlanDuration(response.plan_durations || []);
  //     } else {
  //       showSnackbar(toastMessages.error.common, 'error');
  //     }
  //   } catch {
  //     showSnackbar(toastMessages.error.common, 'error');
  //   }
  //   setLoading(false);
  // };

  /**
   * function to get company modules grouped by parent with backend action
   * @returns {void}
   */
  const handleGetCompanyModules = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanyModulesRequest();
      if (response?.status.response_code === 200) {
        // Transform API data for tree select format
        const modulesData = response.company_modules.map((module: any) => ({
          id: module.id,
          display_name: module.display_name
        }));
        setModules(modulesData);
        console.log('modules data', modulesData);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  // New function to get child modules for a parent module
  // const getChildModules = async (moduleId: number): Promise<number[]> => {
  //   try {
  //     const response = await getCompanyModulesGroupedByParentRequest();
  //     if (response?.status.response_code === 200) {
  //       // Find the parent module
  //       const parentModule = response.company_modules.find(
  //         (module: any) => module.id === moduleId
  //       );

  //       // If found, return all child module IDs
  //       if (parentModule && parentModule.modules) {
  //         return parentModule.modules.map((child: any) => child.id);
  //       }
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error('Error fetching child modules:', error);
  //     return [];
  //   }
  // };

  // // Function to process module IDs before sending to backend
  // const processModuleIds = async (selectedIds: number[]): Promise<number[]> => {
  //   // Map each selected ID to a promise that resolves to its child IDs or itself
  //   const allIds = await Promise.all(
  //     selectedIds.map(async (id) => {
  //       const childIds = await getChildModules(id);
  //       return childIds.length > 0 ? childIds : [id];
  //     })
  //   );

  //   // Flatten the array and remove duplicates
  //   return Array.from(new Set(allIds.flat()));
  // };

  /**
   * Submit function to save company with backend action
   * @param {AddCompanyFormValues} values - input values of form
   * @param {object} {setSubmitting} - function to check submission
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: AddCompanyFormValues,
    { setSubmitting }: any
  ): Promise<void> => {
    if (isLastStep) {
      try {
        // Process module IDs before sending to backend
        // const processedModuleIds = await processModuleIds(
        //   values.ddlModule || []
        // );
        const requestData: any = {
          name: values.txtName.trim(),
          displayName: values.txtDisplayName.trim(),
          address: values.txtAddress.trim(),
          country:
            countries.find((x) => x.alpha2Code === values.txtCountry.trim())
              ?.country || '',
          state: values.txtState.trim(),
          city: values.txtCity.trim(),
          pinCode: values.txtPinCode.trim(),
          domainName: values.txtDomainName.trim(),
          logo: values.fileLogo || null,
          isActive: values.chkIsActive,
          firstName: values.txtFirstName.trim(),
          lastName: values.txtLastName.trim(),
          registeredEmail: values.txtRegisteredEmail.trim(),
          password: values.txtPassword,
          isUserActive: values.chkIsUserActive,
          planId: 1,
          planDuration: values.ddlPlanDuration || 0,
          companyModuleIds: values.ddlModule || null,
          userCount: values.txtUserCount || 0,
          startDate: values.txtStartDate,
          endDate: values.txtEndDate,
          startMonth: values.ddlStartMonth,
          createdBy: user.id
        };
        console.log('Sent Data is', requestData);
        const response = await insertCompanyRequest(requestData);
        if (response?.status.response_code === 200) {
          navigate(manageCompanyPath);
          showSnackbar(
            toastMessages.success.adminDashboard.companySaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.companyDuplicate,
            'error'
          );
        } else if (response?.status.response_code === 205) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } catch {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } else {
      setActiveStep(activeStep + 1);
      setSubmitting(false);
    }
  };

  /**
   * function to get end date
   * @param {Date} date - start date
   * @param {number} {numMonths} - number of months to get end date
   * @returns {string}
   */
  function addMonthsToDate(date: Date, numMonths: number): string {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + numMonths);
    return `${newDate.getDate().toString().padStart(2, '0')}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  }

  const validationSchema = [
    Yup.object().shape({
      txtName: Yup.string()
        .trim()
        .required('Please enter the company name.')
        .matches(
          /^[a-zA-Z0-9 !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
          'Please enter a valid company name'
        ),
      txtDisplayName: Yup.string()
        .trim()
        .required('Please enter the display name.'),
      txtCountry: Yup.string().trim().required('Please select a country.'),
      txtState: Yup.string().trim().required('Please select a state.'),
      txtPinCode: Yup.number(),
      txtDomainName: Yup.string()
        .trim()
        .required('Please enter the domain name.')
        .matches(
          /^[a-zA-Z0-9_]+$/,
          'Please enter only alphabetics, underscore and/or numbers.'
        )
    }),
    Yup.object().shape({
      txtFirstName: Yup.string()
        .trim()
        .required('Please enter the first name.'),
      txtLastName: Yup.string().trim().required('Please enter the last name.'),
      txtRegisteredEmail: Yup.string()
        .email('Please enter the valid email address.')
        .required('Please enter your registered email address.'),
      txtPassword: Yup.string()
        .min(7, 'Password should be minimum 7 characters.')
        .max(100, 'Password should be maximum 100 characters.')
        .required('Please enter the password.'),
      txtConfirmPassword: Yup.string()
        .oneOf([Yup.ref('txtPassword'), undefined], 'Passwords must match!')
        .required('Please enter the confirm password.')
    }),
    Yup.object().shape({
      // ddlPlan: Yup.number().required('Please select the plan.'),
      ddlPlanDuration: Yup.number().when('ddlPlan', {
        is: (v: any) => !!v,
        then: (schema) => schema.required('Please select the plan duration.')
      }),
      ddlModule: Yup.array()
        .min(1, 'Please select at least one module.')
        .required('Please select the module.'),
      txtUserCount: Yup.number().when('ddlPlan', {
        is: (v: any) => !!v,
        then: (schema) =>
          schema
            .positive('Please enter valid user count.')
            .required('Please enter the user count.')
      }),
      txtStartDate: Yup.string().when('ddlPlan', {
        is: (v: any) => !!v,
        then: (schema) => schema.required('Please enter the start date.')
      }),
      ddlStartMonth: Yup.number().required(
        "Please select the company's year format."
      )
    })
  ];
  const currentValidationSchema = validationSchema[activeStep];

  useEffect(() => {
    // handleGetPlans();
    // handleGetPlanDurations();
    handleGetCompanyModules();
  }, []);
  return (
    <Box sx={{ width: '100%' }}>
      <>
        <AdminDashboardPage title="Manage Companies">
          {!loading ? (
            <AdminFormLayout
              title="Add Company"
              subtitle="Please fill the below details to create new company."
            >
              <>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={currentValidationSchema}
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
                    <>
                      <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stepper activeStep={activeStep} sx={{ mt: 2, p: 2 }}>
                          {steps.map((label) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                              optional?: React.ReactNode;
                            } = {};

                            return (
                              <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                        {activeStep === 0 && (
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Company Name"
                                  name="txtName"
                                  value={values.txtName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={(e) => {
                                    setFieldValue(
                                      'txtDomainName',
                                      getDomainName(e.target.value)
                                    );
                                    handleBlur(e);
                                  }}
                                  error={Boolean(
                                    touched.txtName && errors.txtName
                                  )}
                                  helperText={String(
                                    touched.txtName && errors.txtName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Display Name"
                                  name="txtDisplayName"
                                  value={values.txtDisplayName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtDisplayName &&
                                      errors.txtDisplayName
                                  )}
                                  helperText={String(
                                    touched.txtDisplayName &&
                                      errors.txtDisplayName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <TextInput
                                  multiline
                                  label="Address"
                                  name="txtAddress"
                                  value={values.txtAddress}
                                  rows={2}
                                  inputProps={{ maxLength: 1000 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtAddress && errors.txtAddress
                                  )}
                                  helperText={String(
                                    touched.txtAddress && errors.txtAddress
                                  )}
                                  sx={adminStyle.textMultilineInputStyle}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <SelectInput
                                  label="Select Country"
                                  name="txtCountry"
                                  value={values.txtCountry}
                                  onChange={(e) => {
                                    handleChange(e);
                                    handleCountryChange(
                                      e.target.value as string
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtCountry && errors.txtCountry
                                  )}
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
                                <SelectInput
                                  label="Select State"
                                  name="txtState"
                                  value={values.txtState}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtState && errors.txtState
                                  )}
                                  helperText={String(
                                    touched.txtState && errors.txtState
                                  )}
                                >
                                  <MenuItem key="-1" value="">
                                    - None -
                                  </MenuItem>
                                  {states.map((option, i) => (
                                    <MenuItem key={i} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </SelectInput>
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="City"
                                  name="txtCity"
                                  value={values.txtCity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtCity && errors.txtCity
                                  )}
                                  helperText={String(
                                    touched.txtCity && errors.txtCity
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Pincode"
                                  name="txtPinCode"
                                  value={values.txtPinCode}
                                  inputProps={{ maxLength: 6 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtPinCode && errors.txtPinCode
                                  )}
                                  helperText={String(
                                    touched.txtPinCode && errors.txtPinCode
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Domain Name"
                                  name="txtDomainName"
                                  value={values.txtDomainName}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtDomainName &&
                                      errors.txtDomainName
                                  )}
                                  helperText={String(
                                    touched.txtDomainName &&
                                      errors.txtDomainName
                                  )}
                                />
                                <FormHelperText>
                                  Domain name can't be changed, choose wisely!
                                </FormHelperText>
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <CustomField
                                  name="fileLogo"
                                  label="Upload Logo"
                                >
                                  <UploadSingleImage
                                    label="Upload"
                                    file={values.fileLogo}
                                    onFileChange={(val) => {
                                      setFieldValue('fileLogo', val);
                                    }}
                                    aspectRatio={240 / 80}
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
                        )}
                        {activeStep === 1 && (
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="First Name"
                                  name="txtFirstName"
                                  value={values.txtFirstName}
                                  inputProps={{ maxLength: 50 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtFirstName && errors.txtFirstName
                                  )}
                                  helperText={String(
                                    touched.txtFirstName && errors.txtFirstName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Last Name"
                                  name="txtLastName"
                                  value={values.txtLastName}
                                  inputProps={{ maxLength: 50 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtLastName && errors.txtLastName
                                  )}
                                  helperText={String(
                                    touched.txtLastName && errors.txtLastName
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Password"
                                  name="txtPassword"
                                  type="password"
                                  value={values.txtPassword}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtPassword && errors.txtPassword
                                  )}
                                  helperText={String(
                                    touched.txtPassword && errors.txtPassword
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Confirm Password"
                                  name="txtConfirmPassword"
                                  type="password"
                                  value={values.txtConfirmPassword}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtConfirmPassword &&
                                      errors.txtConfirmPassword
                                  )}
                                  helperText={String(
                                    touched.txtConfirmPassword &&
                                      errors.txtConfirmPassword
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={6}>
                                <TextInput
                                  fullWidth
                                  label="Registered Email"
                                  name="txtRegisteredEmail"
                                  value={values.txtRegisteredEmail}
                                  inputProps={{ maxLength: 100 }}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.txtRegisteredEmail &&
                                      errors.txtRegisteredEmail
                                  )}
                                  helperText={String(
                                    touched.txtRegisteredEmail &&
                                      errors.txtRegisteredEmail
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      name="chkIsUserActive"
                                      checked={values.chkIsUserActive}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" ml={2}>
                                      Is User Active
                                    </Typography>
                                  }
                                  sx={adminStyle.formControlLabel}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        )}
                        {activeStep === 2 && (
                          <>
                            <CardContent>
                              <Grid container spacing={2}>
                                {/* <Grid item xs={12} sm={6} md={6}> */}
                                {/* <SelectInput
                                    label="Select Plan"
                                    name="ddlPlan"
                                    value={values.ddlPlan}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlPlan && errors.ddlPlan
                                    )}
                                    helperText={String(
                                      touched.ddlPlan && errors.ddlPlan
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {plans.map((option: ShortPlanModel) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.name}
                                      </MenuItem>
                                    ))}
                                  </SelectInput>
                                </Grid> */}
                                <Grid item md={12} sm={12} xs={12}>
                                  <AutoCompleteInput
                                    multiple
                                    label="Select Modules"
                                    name="ddlModule" // Change to ddlModule to match form values
                                    value={values.ddlModule}
                                    data={
                                      modules?.map(
                                        (val: ShortCompanyModuleModel) => val.id
                                      ) || []
                                    }
                                    originalData={modules}
                                    itemId="id"
                                    itemName="display_name"
                                    placeholder="Search Modules"
                                    limitTags={2}
                                    renderOption={(
                                      props: any,
                                      option: any,
                                      { selected }: any
                                    ) => (
                                      <MenuItem {...props}>
                                        <Checkbox checked={selected} />
                                        {modules?.find(
                                          (val: ShortCompanyModuleModel) =>
                                            val.id === option
                                        )?.display_name || ''}
                                      </MenuItem>
                                    )}
                                    onChange={(selectedValues: number[]) => {
                                      // Directly set the ddlModule value with selected module IDs
                                      setFieldValue(
                                        'ddlModule',
                                        selectedValues
                                      );
                                    }}
                                    error={Boolean(
                                      touched.ddlModule && errors.ddlModule
                                    )}
                                    helperText={String(
                                      touched.ddlModule && errors.ddlModule
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Company Year Format"
                                    name="ddlStartMonth"
                                    value={values.ddlStartMonth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlStartMonth &&
                                        errors.ddlStartMonth
                                    )}
                                    helperText={String(
                                      touched.ddlStartMonth &&
                                        errors.ddlStartMonth
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    <MenuItem key="0" value="1">
                                      Jan - Dec
                                    </MenuItem>
                                    <MenuItem key="1" value="4">
                                      Apr - Mar
                                    </MenuItem>
                                  </SelectInput>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="User Count"
                                    name="txtUserCount"
                                    type="number"
                                    value={values.txtUserCount}
                                    inputProps={{ min: 1 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtUserCount &&
                                        errors.txtUserCount
                                    )}
                                    helperText={String(
                                      touched.txtUserCount &&
                                        errors.txtUserCount
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Duration"
                                    name="ddlPlanDuration"
                                    value={values.ddlPlanDuration}
                                    onChange={(e: any) => {
                                      const duration = e.target.value;
                                      setFieldValue(
                                        'ddlPlanDuration',
                                        duration
                                      );
                                      if (duration && values.txtStartDate) {
                                        const endDateTest = addMonthsToDate(
                                          new Date(values.txtStartDate),
                                          duration
                                        );
                                        setFieldValue(
                                          'txtEndDate',
                                          moment(
                                            endDateTest,
                                            'DD/MM/YYYY'
                                          ).toDate()
                                        );
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlPlanDuration &&
                                        errors.ddlPlanDuration
                                    )}
                                    helperText={String(
                                      touched.ddlPlanDuration &&
                                        errors.ddlPlanDuration
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {PlanDuration.map(
                                      (option: ShortPlanDurationModel) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.no_of_month}
                                        >
                                          {`${option.no_of_month} ${
                                            option.no_of_month < 1
                                              ? 'Month'
                                              : 'Months'
                                          }`}
                                        </MenuItem>
                                      )
                                    )}
                                  </SelectInput>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtStartDate}
                                      onChange={(date: any) => {
                                        setFieldValue('txtStartDate', date);
                                        if (date !== null) {
                                          if (values.ddlPlanDuration) {
                                            const endDateTest = addMonthsToDate(
                                              date,
                                              values.ddlPlanDuration
                                            );
                                            setFieldValue(
                                              'txtEndDate',
                                              moment(
                                                endDateTest,
                                                'DD/MM/YYYY'
                                              ).toDate()
                                            );
                                          }
                                        }
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtStartDate"
                                          label="Start Date"
                                          error={Boolean(
                                            touched.txtStartDate &&
                                              errors.txtStartDate
                                          )}
                                          helperText={String(
                                            touched.txtStartDate &&
                                              errors.txtStartDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtStartDate"
                                            value={values.txtStartDate}
                                            error={Boolean(
                                              touched.txtStartDate &&
                                                errors.txtStartDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      disabled
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtEndDate}
                                      onChange={handleChange}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtEndDate"
                                          label="End Date"
                                          error={Boolean(
                                            touched.txtEndDate &&
                                              errors.txtEndDate
                                          )}
                                          helperText={String(
                                            touched.txtEndDate &&
                                              errors.txtEndDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtEndDate"
                                            value={values.txtEndDate}
                                            error={Boolean(
                                              touched.txtEndDate &&
                                                errors.txtEndDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </>
                        )}
                        <CardActions>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            {activeStep === 0 ? 'Back' : 'Previous Step'}
                          </Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {activeStep === steps.length - 1
                              ? 'Save'
                              : 'Next Step'}
                          </Button>
                        </CardActions>
                      </Form>
                    </>
                  )}
                </Formik>
              </>
            </AdminFormLayout>
          ) : (
            <Loader />
          )}
        </AdminDashboardPage>
      </>
    </Box>
  );
};

export default CreateCompany;
