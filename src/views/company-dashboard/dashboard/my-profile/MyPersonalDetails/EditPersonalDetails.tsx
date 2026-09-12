/* Imports */
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  // Checkbox,
  Divider,
  Grid,
  MenuItem,
  TextField
  // Typography,
  // styled
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  countries,
  employeePersonalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  EditEmployeePersonalDetailsFormValues,
  PersonalDetailsValues
} from 'models/company/employee';
import { CustomField, SelectInput, TextInput } from 'components/InputFields';
import {
  getEmployeePersonalDetailsByUserIdRequest,
  insertEmployeePersonalDetailRequest,
  updateEmployeePersonalDetailRequest
} from 'services/company/employee/personalDetails';
import { getDate } from 'utility/formatDate';

/* Local Imports */
import Loader from 'components/Loader';
import { calculateAge } from 'utility/calculateAge';
import styles from './personal.style';

interface IEditPersonalDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit profile information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditPersonalDetails = ({
  handleViewMode
}: IEditPersonalDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [
    initialValuesEditPersonalDetails,
    setInitialValuesEditPersonalDetails
  ] = useState({
    txtId: null,
    txtBirthDate: '',
    txtAge: 0,
    ddlBirthCountry: '',
    ddlBirthState: '',
    txtBirthLocation: '',
    ddlGender: '',
    ddlMaritalStatus: '',
    txtMarriageDate: '',
    ddlBloodGroup: '',
    txtPanNumber: '',
    txtCaste: '',
    txtReligion: '',
    txtResidence: ''
  } as EditEmployeePersonalDetailsFormValues);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);
  const [personalId, setPersonalId] = useState<number>();

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtBirthDate: Yup.date()
      .required('Please enter the birth date.')
      .max(new Date(), 'Birth date cannot be in the future.'),
    txtAge: Yup.number().nullable(),
    ddlBirthCountry: Yup.string().required('Please select the birth country.'),
    ddlBirthState: Yup.string().required('Please select the birth state.'),
    txtBirthLocation: Yup.string().required('Please enter the birth location.'),
    // .matches(
    //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
    //   'Only letters, spaces, and special characters are allowed'
    // ),
    ddlGender: Yup.string().required('Please select the gender.'),
    ddlMaritalStatus: Yup.string().required(
      'Please select the marital status.'
    ),
    txtMarriageDate: Yup.date().when(['ddlMaritalStatus'], {
      is: (status: any) => ['married', 'widowed', 'divorced'].includes(status),
      then: (schema) => schema.required('Please enter the marriage date.'),
      otherwise: (schema) => schema.nullable()
    }),
    ddlBloodGroup: Yup.string().required('Please select the blood group.'),
    txtPanNumber: Yup.string()
      .transform((value) => value.toUpperCase()) // Convert input to uppercase
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number.')
      .required('Please enter the PAN number.'),
    txtCaste: Yup.string().matches(
      /^[a-zA-Z]+$/,
      'Please enter only alphabets.'
    ),
    txtReligion: Yup.string().matches(
      /^[a-zA-Z]+$/,
      'Please enter only alphabets.'
    ),
    txtResidence: Yup.string().matches(
      /^[a-zA-Z]+$/,
      'Please enter only alphabets.'
    )
  });

  /**
   * function to handle country change
   * @return {void}
   */
  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  const getEmployeePersonalDetailsByUserId = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeePersonalDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    setPersonalId(response?.employeePersonalDetail?.id);
    const personalDetailsData: PersonalDetailsValues =
      response?.employeePersonalDetail;
    if (personalDetailsData) {
      const countryCode =
        countries.find(
          (x) => x.alpha2Code === personalDetailsData.birth_country?.trim()
        )?.alpha2Code || '';
      console.log('country code ', countryCode);
      handleCountryChange(countryCode);
      setInitialValuesEditPersonalDetails({
        txtId: personalDetailsData?.id,
        txtBirthDate: personalDetailsData.birth_date,
        txtAge: personalDetailsData.age,
        ddlBirthCountry: countryCode,
        ddlBirthState: personalDetailsData.birth_state,
        txtBirthLocation: personalDetailsData.birth_location,
        ddlGender: personalDetailsData.gender,
        ddlMaritalStatus: personalDetailsData.marital_status,
        txtMarriageDate: personalDetailsData.marriage_date,
        ddlBloodGroup: personalDetailsData.blood_group,
        txtPanNumber: personalDetailsData.pan_number,
        txtCaste: personalDetailsData.caste,
        txtReligion: personalDetailsData.religion,
        txtResidence: personalDetailsData.residence
      });
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */

  const handleFormSubmit = async (
    values: EditEmployeePersonalDetailsFormValues,
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }
      const requestData: any = {
        birthDate: values.txtBirthDate,
        age: values.txtAge,
        birthCountry: values.ddlBirthCountry,
        birthState: values.ddlBirthState,
        birthLocation: values.txtBirthLocation,
        gender: values.ddlGender,
        maritalStatus: values.ddlMaritalStatus,
        bloodGroup: values.ddlBloodGroup,
        panNumber: values.txtPanNumber,
        caste: values.txtCaste,
        religion: values.txtReligion,
        residence: values.txtResidence
      };

      if (values.ddlMaritalStatus !== 'single') {
        requestData.marriageDate = values.txtMarriageDate;
      }

      let response;
      if (personalId) {
        response = await updateEmployeePersonalDetailRequest(
          personalId,
          requestData
        );
      } else {
        requestData.userId = user?.id;
        response = await insertEmployeePersonalDetailRequest(requestData);
      }

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeePersonalDetailsUpdated,
          'success'
        );
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getEmployeePersonalDetailsByUserId();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValuesEditPersonalDetails}
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
        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Box>
            <Card sx={styles.profileCard}>
              <CardHeader
                subheader="Please update the details below to update personal details."
                title="Edit Personal Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          openTo="day"
                          inputFormat="DD/MM/YYYY"
                          value={values.txtBirthDate}
                          onChange={(newValue: any) => {
                            const birthDate = getDate(newValue, 'dd MMM yyyy');
                            setFieldValue('txtBirthDate', birthDate);
                            const age = calculateAge(birthDate);
                            setFieldValue('txtAge', age);
                          }}
                          renderInput={(params: any) => (
                            <CustomField
                              name="txtBirthDate"
                              label="Birth Date"
                              error={Boolean(
                                touched.txtBirthDate && errors.txtBirthDate
                              )}
                              helperText={String(
                                touched.txtBirthDate && errors.txtBirthDate
                              )}
                            >
                              <TextField
                                {...params}
                                fullWidth
                                size="medium"
                                name="txtBirthDate"
                                value={values.txtBirthDate}
                                error={Boolean(
                                  touched.txtBirthDate && errors.txtBirthDate
                                )}
                                inputProps={{
                                  ...params.inputProps,
                                  readOnly: true,
                                  placeholder: 'DD/MM/YYYY'
                                }}
                              />
                            </CustomField>
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Age"
                        name="txtAge"
                        type="number"
                        value={values.txtAge}
                        inputProps={{ readOnly: true }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtAge && errors.txtAge)}
                        helperText={String(touched.txtAge && errors.txtAge)}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Birth Country"
                        name="ddlBirthCountry"
                        value={values.ddlBirthCountry}
                        onChange={(e) => {
                          handleChange(e);
                          handleCountryChange(e.target.value as string);
                        }}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlBirthCountry && errors.ddlBirthCountry
                        )}
                        helperText={String(
                          touched.ddlBirthCountry && errors.ddlBirthCountry
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
                        label="Select Birth State"
                        name="ddlBirthState"
                        value={values.ddlBirthState}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlBirthState && errors.ddlBirthState
                        )}
                        helperText={String(
                          touched.ddlBirthState && errors.ddlBirthState
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
                        label="Birth Location"
                        name="txtBirthLocation"
                        value={values.txtBirthLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtBirthLocation && errors.txtBirthLocation
                        )}
                        helperText={String(
                          touched.txtBirthLocation && errors.txtBirthLocation
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Gender"
                        name="ddlGender"
                        value={values.ddlGender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.ddlGender && errors.ddlGender)}
                        helperText={String(
                          touched.ddlGender && errors.ddlGender
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {employeePersonalDetails.gender.map((option: any) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Marital Status"
                        name="ddlMaritalStatus"
                        value={values.ddlMaritalStatus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlMaritalStatus && errors.ddlMaritalStatus
                        )}
                        helperText={String(
                          touched.ddlMaritalStatus && errors.ddlMaritalStatus
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {employeePersonalDetails.maritalStatus.map(
                          (option: any) => (
                            <MenuItem key={option.id} value={option.value}>
                              {option.name}
                            </MenuItem>
                          )
                        )}
                      </SelectInput>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          openTo="day"
                          inputFormat="DD/MM/YYYY"
                          value={values.txtMarriageDate}
                          disabled={values.ddlMaritalStatus === 'single'}
                          onChange={(newValue: any) => {
                            setFieldValue('txtMarriageDate', newValue);
                          }}
                          renderInput={(params: any) => (
                            <CustomField
                              name="txtMarriageDate"
                              label="Marriage Date"
                              error={Boolean(
                                touched.txtMarriageDate &&
                                  errors.txtMarriageDate
                              )}
                              helperText={String(
                                touched.txtMarriageDate &&
                                  errors.txtMarriageDate
                              )}
                            >
                              <TextField
                                {...params}
                                fullWidth
                                size="medium"
                                name="txtMarriageDate"
                                value={values.txtMarriageDate}
                                error={Boolean(
                                  touched.txtMarriageDate &&
                                    errors.txtMarriageDate
                                )}
                              />
                            </CustomField>
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <SelectInput
                        label="Select Blood Group"
                        name="ddlBloodGroup"
                        value={values.ddlBloodGroup}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlBloodGroup && errors.ddlBloodGroup
                        )}
                        helperText={String(
                          touched.ddlBloodGroup && errors.ddlBloodGroup
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {employeePersonalDetails.bloodGroups.map(
                          (option: any) => (
                            <MenuItem key={option.id} value={option.value}>
                              {option.name}
                            </MenuItem>
                          )
                        )}
                      </SelectInput>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Pan Number"
                        name="txtPanNumber"
                        value={values.txtPanNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtPanNumber && errors.txtPanNumber
                        )}
                        helperText={String(
                          touched.txtPanNumber && errors.txtPanNumber
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Caste"
                        name="txtCaste"
                        value={values.txtCaste}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtCaste && errors.txtCaste)}
                        helperText={String(touched.txtCaste && errors.txtCaste)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Religion"
                        name="txtReligion"
                        value={values.txtReligion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtReligion && errors.txtReligion
                        )}
                        helperText={String(
                          touched.txtReligion && errors.txtReligion
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextInput
                        fullWidth
                        label="Residence"
                        name="txtResidence"
                        value={values.txtResidence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtResidence && errors.txtResidence
                        )}
                        helperText={String(
                          touched.txtResidence && errors.txtResidence
                        )}
                      />
                    </Grid>
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
                  </Grid>
                </CardContent>
              ) : (
                <Loader />
              )}
            </Card>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditPersonalDetails;
