/* Imports */
import {
  Box,
  Button,
  // Stepper,
  Typography,
  // Step,
  // StepLabel,
  // CardActions,
  CardContent,
  FormControlLabel,
  Grid,
  // Switch,
  // TextField,
  MenuItem,
  // FormHelperText,
  Checkbox,
  // StepConnector,
  Card,
  // IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  // styled,
  // stepConnectorClasses,
  CardHeader,
  Divider
} from '@mui/material';
import { FieldArray, Form, Formik, getIn } from 'formik';
// import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  countries,
  // employeeAddressDetails,
  // employeeEducationDetails,
  // employeeEmergencyContactDetails,
  // employeePersonalDetails,
  // employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  EditEmployeeAddressDetailsFormValues
  // EditEmployeeEducationDetailsFormValues,
  // EditEmployeeEmergencyContactDetailsFormValues,
  // EditEmployeeExperienceDetailsFormValues,
  // EditEmployeePersonalDetailsFormValues,
  // PersonalDetailsValues
} from 'models/company/employee';
import { SelectInput, TextInput } from 'components/InputFields';
// import {
//   getEmployeePersonalDetailsByUserIdRequest,
//   updateEmployeePersonalDetailRequest
// } from 'services/company/employee/personalDetails';
// import { getDate } from 'utility/formatDate';

/* Local Imports */
import Loader from 'components/Loader';
// import {
//   getEmployeeEmergencyContactDetailsByUserIdRequest,
//   saveEmployeeEmergencyContactDetailRequest
// } from 'services/company/employee/emergencyContactDetails';
// import {
//   getEmployeeEducationDetailsByUserIdRequest,
//   saveEmployeeEducationDetailRequest
// } from 'services/company/employee/educationDetails';
// import {
//   getEmployeeExperienceDetailsByUserIdRequest,
//   SaveEmployeeExperienceDetails
// } from 'services/company/employee/experienceDetails';
import {
  getEmployeeAddressDetailsByUserIdRequest,
  saveEmployeeAddressDetailRequest
} from 'services/company/employee/addressDetails';
import styles from './address.style';

interface IEditAddressDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit emergency contact information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditAddressDetails = ({
  handleViewMode
}: IEditAddressDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeAddressDetailsFormValues[]
  >([
    {
      txtId: null,
      ddlAddressType: 'present', // Default to "present"
      txtBuildingName: '',
      txtFlatNumber: '',
      txtStreetName: '',
      txtLandmark: '',
      txtCity: '',
      ddlCountry: '',
      ddlState: '',
      txtPincode: '',
      txtPhone: ''
    },
    {
      txtId: null,
      ddlAddressType: 'permanent', // Default to "permanent"
      txtBuildingName: '',
      txtFlatNumber: '',
      txtStreetName: '',
      txtLandmark: '',
      txtCity: '',
      ddlCountry: '',
      ddlState: '',
      txtPincode: '',
      txtPhone: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    addressDetails: Yup.array()
      .of(
        Yup.object().shape({
          // ddlAddressType: Yup.string().required(
          //   'Please select the address type.'
          // ),
          txtBuildingName: Yup.string()
            // .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols not allowed')
            .required('Please enter the Building Name.'),
          txtFlatNumber: Yup.string()
            // .matches(/^[0-9]/, 'Please Enter only numeric values')
            .required('Please enter the Flat Number.'),
          txtStreetName: Yup.string(),
          // txtLandmark: Yup.string().matches(
          //   /^[a-zA-Z]*$/,
          //   'Please enter only alphabets.'
          // ),
          txtCity: Yup.string()
            .required('Please enter the city.')
            .matches(/^[a-zA-Z]*$/, 'Please enter only alphabets.'),
          ddlCountry: Yup.string().required('Please select the countyr'),
          ddlState: Yup.string().required('Please select the state.'),
          txtPincode: Yup.string()
            .matches(/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode.')
            .required('Please enter the pincode.'),
          txtTelephoneNumber: Yup.string().matches(
            /^\d{3}-\d{7,10}$/,
            'Please enter a valid telephone number.'
          ),

          txtPhone: Yup.string()
            .matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit phone number.'
            )
            .required('Please enter the phone number.')
        })
      )
      .min(1, 'Please add at least one address.')
  });

  /**
   * function to handle country change
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */

  const handleFormSubmit = async (
    values: {
      addressDetails: EditEmployeeAddressDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      console.log('submit called');
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.addressDetails.map((detail) => {
        // Create base contact data
        const baseContact = {
          addressType: detail.ddlAddressType,
          buildingName: detail.txtBuildingName,
          flatNumber: detail.txtFlatNumber,
          streetName: detail.txtStreetName,
          landmark: detail.txtLandmark,
          city: detail.txtCity,
          state: detail.ddlState,
          pincode: detail.txtPincode,
          telephoneNumber: detail.txtTelephoneNumber,
          phone: detail.txtPhone,
          userId: user.id
        };

        // If id exists, include it in the object
        if (detail.txtId !== null) {
          return {
            ...baseContact,
            id: detail.txtId
          };
        }

        // Return base contact without id for new contacts
        return baseContact;
      });

      console.log('req data is', requestData);

      const response = await saveEmployeeAddressDetailRequest({
        employeeAddresses: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeAddressDetailsUpdated,
          'success'
        );
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getEmployeeAddressDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeAddressDetailsByUserIdRequest(
      Number(user?.id)
    );
    // setUserId(response.employeeAddresses[0].user_id);
    console.log('Address response', response);
    const addressData = response?.employeeAddresses;
    const companyCountryAlphaCode =
      countries.find((x) => x.country === addressData.country?.trim() || '')
        ?.alpha2Code || '';
    handleCountryChange(companyCountryAlphaCode);
    const presentAddress = addressData.find(
      (address: any) => address.address_type === 'present'
    );
    const permanentAddress = addressData.find(
      (address: any) => address.address_type === 'permanent'
    );
    if (addressData?.length) {
      setInitialValues([
        {
          txtId: presentAddress?.id || null,
          ddlAddressType: presentAddress?.address_type || 'present',
          txtBuildingName: presentAddress?.building_name || '',
          txtFlatNumber: presentAddress?.flat_number || '',
          txtStreetName: presentAddress?.street_name || '',
          txtLandmark: presentAddress?.landmark || '',
          txtCity: presentAddress?.city || '',
          ddlCountry: presentAddress?.country || '',
          ddlState: presentAddress?.state || '',
          txtPincode: presentAddress?.pincode || '',
          txtPhone: presentAddress?.phone || ''
        },
        {
          txtId: permanentAddress?.id || null,
          ddlAddressType: permanentAddress?.address_type || 'permanent',
          txtBuildingName: permanentAddress?.building_name || '',
          txtFlatNumber: permanentAddress?.flat_number || '',
          txtStreetName: permanentAddress?.street_name || '',
          txtLandmark: permanentAddress?.landmark || '',
          txtCity: permanentAddress?.city || '',
          ddlCountry: permanentAddress?.country || '',
          ddlState: permanentAddress?.state || '',
          txtPincode: permanentAddress?.pincode || '',
          txtPhone: permanentAddress?.phone || ''
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      getEmployeeAddressDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ addressDetails: initialValues }}
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
      }) => {
        console.log('error', errors);
        return (
          <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <Box>
              <Card sx={styles.profileCard}>
                <CardHeader
                  subheader="Please update the details below to update address."
                  title="Edit Address Details"
                  sx={styles.cardHeaderEdit}
                  titleTypographyProps={{ variant: 'h3', component: 'h3' }}
                />
                <Divider />
                {!loading ? (
                  <CardContent>
                    <FieldArray name="addressDetails">
                      {() => (
                        <div
                          style={{
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Accordion
                            sx={{ mb: 2, borderRadius: '8px' }}
                            defaultExpanded
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="present-address-content"
                              id="present-address-header"
                              sx={{
                                backgroundColor: '#1976d2',
                                color: 'white'
                              }}
                            >
                              <Typography variant="subtitle1">
                                Present Address
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                {/* <Grid item xs={12} sm={6} md={6}>
                                <SelectInput
                                  label="Select Address Type"
                                  name={`addressDetails.${0}.ddlAddressType`}
                                  value={
                                    values.addressDetails[0].ddlAddressType
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    getIn(
                                      touched,
                                      `addressDetails.${0}.ddlAddressType`
                                    ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.ddlAddressType`
                                      )
                                  )}
                                  helperText={
                                    getIn(
                                      touched,
                                      `addressDetails.${0}.ddlAddressType`
                                    ) &&
                                    getIn(
                                      errors,
                                      `addressDetails.${0}.ddlAddressType`
                                    )
                                  }
                                >
                                  <MenuItem value="">- None -</MenuItem>
                                  {employeeAddressDetails.addressType.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.value}
                                      >
                                        {option.name}
                                      </MenuItem>
                                    )
                                  )}
                                </SelectInput>
                              </Grid> */}

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Building Name"
                                    name={`addressDetails.${0}.txtBuildingName`}
                                    value={
                                      values.addressDetails[0].txtBuildingName
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtBuildingName`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtBuildingName`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtBuildingName`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtBuildingName`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Flat No"
                                    name={`addressDetails.${0}.txtFlatNumber`}
                                    value={
                                      values.addressDetails[0].txtFlatNumber
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtFlatNumber`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtFlatNumber`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtFlatNumber`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtFlatNumber`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Street Name"
                                    name={`addressDetails.${0}.txtStreetName`}
                                    value={
                                      values.addressDetails[0].txtStreetName
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtStreetName`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtStreetName`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtStreetName`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtStreetName`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Landmark"
                                    name={`addressDetails.${0}.txtLandmark`}
                                    value={values.addressDetails[0].txtLandmark}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtLandmark`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtLandmark`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtLandmark`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtLandmark`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="City"
                                    name={`addressDetails.${0}.txtCity`}
                                    value={values.addressDetails[0].txtCity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtCity`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtCity`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtCity`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtCity`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Country"
                                    name={`addressDetails.${0}.ddlCountry`}
                                    value={values.addressDetails[0].ddlCountry}
                                    onChange={(e) => {
                                      handleChange(e);
                                      handleCountryChange(
                                        e.target.value as string
                                      );
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.ddlCountry`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.ddlCountry`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.ddlCountry`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.ddlCountry`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {countries.map((option, i) => (
                                      <MenuItem
                                        key={i}
                                        value={option.alpha2Code}
                                      >
                                        {option.country}
                                      </MenuItem>
                                    ))}
                                  </SelectInput>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="State"
                                    name={`addressDetails.${0}.ddlState`}
                                    value={values.addressDetails[0].ddlState}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.ddlState`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.ddlState`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.ddlState`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.ddlState`
                                      )
                                    }
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
                                    label="Pincode"
                                    name={`addressDetails.${0}.txtPincode`}
                                    value={values.addressDetails[0].txtPincode}
                                    inputProps={{ maxLength: 6 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtPincode`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtPincode`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtPincode`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtPincode`
                                      )
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Mobile No"
                                    name={`addressDetails.${0}.txtPhone`}
                                    type="number"
                                    value={values.addressDetails[0].txtPhone}
                                    inputProps={{ maxLength: 10 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtPhone`
                                      ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${0}.txtPhone`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `addressDetails.${0}.txtPhone`
                                      ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${0}.txtPhone`
                                      )
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sameAsPresentAddress}
                                onChange={(e) => {
                                  setSameAsPresentAddress(e.target.checked);
                                  if (e.target.checked) {
                                    const presentAddress =
                                      values.addressDetails[0];
                                    setFieldValue('addressDetails.1', {
                                      ...presentAddress,
                                      txtId: initialValues[1].txtId,
                                      ddlAddressType: 'permanent'
                                    });
                                  }
                                }}
                              />
                            }
                            label="Is Permanent Address same as Present Address?"
                          />

                          {!sameAsPresentAddress && (
                            <Accordion
                              defaultExpanded={!sameAsPresentAddress}
                              sx={{ mb: 2, borderRadius: '8px' }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="permanent-address-content"
                                id="permanent-address-header"
                                sx={{
                                  backgroundColor: '#1976d2',
                                  color: 'white'
                                }}
                              >
                                <Typography variant="subtitle1">
                                  Permanent Address
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  {/* <Grid item xs={12} sm={6} md={6}>
                                <SelectInput
                                  label="Select Address Type"
                                  name={`addressDetails.${1}.ddlAddressType`}
                                  value={
                                    values.addressDetails[1].ddlAddressType
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    getIn(
                                      touched,
                                      `addressDetails.${1}.ddlAddressType`
                                    ) &&
                                      getIn(
                                        errors,
                                        `addressDetails.${1}.ddlAddressType`
                                      )
                                  )}
                                  helperText={
                                    getIn(
                                      touched,
                                      `addressDetails.${1}.ddlAddressType`
                                    ) &&
                                    getIn(
                                      errors,
                                      `addressDetails.${1}.ddlAddressType`
                                    )
                                  }
                                >
                                  <MenuItem value="">- None -</MenuItem>
                                  {employeeAddressDetails.addressType.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.value}
                                      >
                                        {option.name}
                                      </MenuItem>
                                    )
                                  )}
                                </SelectInput>
                              </Grid> */}

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Building Name"
                                      name={`addressDetails.${1}.txtBuildingName`}
                                      value={
                                        values.addressDetails[1].txtBuildingName
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtBuildingName`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtBuildingName`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtBuildingName`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtBuildingName`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Flat No"
                                      name={`addressDetails.${1}.txtFlatNumber`}
                                      value={
                                        values.addressDetails[1].txtFlatNumber
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtFlatNumber`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtFlatNumber`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtFlatNumber`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtFlatNumber`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Street Name"
                                      name={`addressDetails.${1}.txtStreetName`}
                                      value={
                                        values.addressDetails[1].txtStreetName
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtStreetName`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtStreetName`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtStreetName`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtStreetName`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Landmark"
                                      name={`addressDetails.${1}.txtLandmark`}
                                      value={
                                        values.addressDetails[1].txtLandmark
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtLandmark`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtLandmark`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtLandmark`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtLandmark`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="City"
                                      name={`addressDetails.${1}.txtCity`}
                                      value={values.addressDetails[1].txtCity}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtCity`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtCity`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtCity`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtCity`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Country"
                                      name={`addressDetails.${1}.ddlCountry`}
                                      value={
                                        values.addressDetails[1].ddlCountry
                                      }
                                      onChange={(e) => {
                                        handleChange(e);
                                        handleCountryChange(
                                          e.target.value as string
                                        );
                                      }}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.ddlCountry`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.ddlCountry`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.ddlCountry`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.ddlCountry`
                                        )
                                      }
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {countries.map((option, i) => (
                                        <MenuItem
                                          key={i}
                                          value={option.alpha2Code}
                                        >
                                          {option.country}
                                        </MenuItem>
                                      ))}
                                    </SelectInput>
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="State"
                                      name={`addressDetails.${1}.ddlState`}
                                      value={values.addressDetails[1].ddlState}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.ddlState`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.ddlState`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.ddlState`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.ddlState`
                                        )
                                      }
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
                                      label="Pincode"
                                      name={`addressDetails.${1}.txtPincode`}
                                      value={
                                        values.addressDetails[1].txtPincode
                                      }
                                      inputProps={{ maxLength: 6 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtPincode`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtPincode`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtPincode`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtPincode`
                                        )
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Mobile No"
                                      name={`addressDetails.${1}.txtPhone`}
                                      type="number"
                                      value={values.addressDetails[1].txtPhone}
                                      inputProps={{ maxLength: 10 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtPhone`
                                        ) &&
                                          getIn(
                                            errors,
                                            `addressDetails.${1}.txtPhone`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `addressDetails.${1}.txtPhone`
                                        ) &&
                                        getIn(
                                          errors,
                                          `addressDetails.${1}.txtPhone`
                                        )
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </div>
                      )}
                    </FieldArray>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" p={2}>
                        <LoadingButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          loading={isSubmitting}
                          sx={{ m: 1 }}
                        >
                          {isSubmitting ? 'Please wait...' : 'Update'}
                        </LoadingButton>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => handleViewMode(false)}
                          sx={{ m: 1 }}
                        >
                          {id ? 'Cancel' : 'Back'}
                        </Button>
                      </Box>
                    </Grid>
                  </CardContent>
                ) : (
                  <Loader />
                )}
              </Card>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditAddressDetails;
