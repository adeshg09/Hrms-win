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
  // FormControlLabel,
  Grid,
  // Switch,
  TextField,
  MenuItem,
  // FormHelperText,
  // Checkbox,
  // StepConnector,
  Card,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  // styled,
  // stepConnectorClasses,
  CardHeader,
  Divider
} from '@mui/material';
import { FieldArray, Form, Formik, getIn } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  // employeeEducationDetails,
  // employeeEmergencyContactDetails,
  // employeePersonalDetails,
  employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  // EditEmployeeEducationDetailsFormValues,
  // EditEmployeeEmergencyContactDetailsFormValues,
  EditEmployeeExperienceDetailsFormValues
  // EditEmployeePersonalDetailsFormValues,
  // PersonalDetailsValues
} from 'models/company/employee';
import { CustomField, SelectInput, TextInput } from 'components/InputFields';
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
import {
  getEmployeeExperienceDetailsByUserIdRequest,
  SaveEmployeeExperienceDetails
} from 'services/company/employee/experienceDetails';
import styles from './experience.style';

interface IEditExperienceDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit experience information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditExperienceDetails = ({
  handleViewMode
}: IEditExperienceDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeExperienceDetailsFormValues[]
  >([
    {
      txtId: null,
      txtCompanyName: '',
      txtEmployeeId: '',
      txtJobTitle: '',
      txtStartDate: '',
      txtEndDate: '',
      ddlCountry: '',
      txtCity: '',
      ddlState: '',
      ddlEmploymentType: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    experienceDetails: Yup.array()
      .of(
        Yup.object().shape({
          txtCompanyName: Yup.string().required(
            'Please enter the company name.'
          ),
          // .matches(
          //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
          //   'Only letters, spaces, and special characters are allowed'
          // ),
          txtEmployeeId: Yup.string().required('Please enter the employee ID.'),
          txtJobTitle: Yup.string().required('Please enter the job title.'),
          // .matches(
          //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
          //   'Only letters, spaces, and special characters are allowed'
          // ),
          txtStartDate: Yup.date()
            .required('Please enter the start date.')
            .max(new Date(), 'Start date cannot be in the future.'),
          txtEndDate: Yup.date()
            .min(Yup.ref('txtStartDate'), 'End date must be after start date.')
            .required('Please enter the end date.'),
          ddlCountry: Yup.string().required('Please select the country.'),
          txtCity: Yup.string().required('Please enter the city.'),
          ddlState: Yup.string().required('Please select the state.'),
          ddlEmploymentType: Yup.string().required(
            'Please select the employment type.'
          )
        })
      )
      .min(1, 'Please add at least one experience record.')
  });
  const getEmployeeExperienceDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeExperienceDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const experienceData = response?.employeeExperienceDetails;
    if (experienceData?.length) {
      const formatteddata = experienceData.map((experience: any) => ({
        txtId: experience.id,
        txtCompanyName: experience.company_name,
        txtEmployeeId: experience.employee_id,
        txtJobTitle: experience.job_title,
        txtStartDate: experience.start_date,
        txtEndDate: experience.end_date,
        ddlCountry: experience.country,
        txtCity: experience.city,
        ddlState: experience.state,
        ddlEmploymentType: experience.employment_type
      }));
      setInitialValues(formatteddata);
    }
    setLoading(false);
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
   * Submit function to save/update user with backend action
   * @param {UserFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */

  const handleFormSubmit = async (
    values: {
      experienceDetails: EditEmployeeExperienceDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.experienceDetails.map((detail) => {
        // Create base contact data
        const baseContact = {
          companyName: detail.txtCompanyName,
          employeeId: detail.txtEmployeeId,
          jobTitle: detail.txtJobTitle,
          startDate: detail.txtStartDate,
          endDate: detail.txtEndDate,
          country: detail.ddlCountry,
          city: detail.txtCity,
          state: detail.ddlState,
          employmentType: detail.ddlEmploymentType,
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

      const response = await SaveEmployeeExperienceDetails({
        experienceDetails: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeExperienceDetailsUpdated,
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
      getEmployeeExperienceDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ experienceDetails: initialValues }}
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
                subheader="Please update the details below to update experience details."
                title="Edit Experience Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <FieldArray name="experienceDetails">
                    {({ push, remove }) => (
                      <div
                        style={{
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            push({
                              txtId: null,
                              txtCompanyName: '',
                              txtEmployeeId: '',
                              txtJobTitle: '',
                              txtStartDate: '',
                              txtEndDate: '',
                              ddlCountry: '',
                              txtCity: '',
                              ddlState: '',
                              ddlEmploymentType: '',
                              txtSupervisorName: '',
                              txtSupervisorPhone: ''
                            })
                          }
                          sx={{ ml: 80, mb: 2 }}
                        >
                          Add Experience
                        </Button>
                        {values.experienceDetails.map((experience, index) => (
                          <Accordion key={index} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`experience-${index}-content`}
                              id={`experience-${index}-header`}
                              sx={{
                                backgroundColor: '#1976d2',
                                color: 'white'
                              }}
                            >
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={11}>
                                  <Typography variant="subtitle1">
                                    Experience #{index + 1}
                                    {experience.txtCompanyName &&
                                      ` - ${experience.txtCompanyName}`}
                                    {experience.txtJobTitle &&
                                      ` (${experience.txtJobTitle})`}
                                  </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                  {index > 0 && (
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remove(index);
                                      }}
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Company Name"
                                    name={`experienceDetails.${index}.txtCompanyName`}
                                    value={
                                      values.experienceDetails[index]
                                        .txtCompanyName
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtCompanyName`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.txtCompanyName`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtCompanyName`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.txtCompanyName`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Employee ID"
                                    name={`experienceDetails.${index}.txtEmployeeId`}
                                    value={
                                      values.experienceDetails[index]
                                        .txtEmployeeId
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtEmployeeId`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.txtEmployeeId`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtEmployeeId`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.txtEmployeeId`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Job Title"
                                    name={`experienceDetails.${index}.txtJobTitle`}
                                    value={
                                      values.experienceDetails[index]
                                        .txtJobTitle
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtJobTitle`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.txtJobTitle`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtJobTitle`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.txtJobTitle`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={
                                        values.experienceDetails[index]
                                          .txtStartDate
                                      }
                                      onChange={(newValue) => {
                                        setFieldValue(
                                          `experienceDetails.${index}.txtStartDate`,
                                          newValue
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <CustomField
                                          name={`experienceDetails.${index}.txtStartDate`}
                                          label="Start Date"
                                          error={Boolean(
                                            getIn(
                                              touched,
                                              `experienceDetails.${index}.txtStartDate`
                                            ) &&
                                              getIn(
                                                errors,
                                                `experienceDetails.${index}.txtStartDate`
                                              )
                                          )}
                                          helperText={
                                            getIn(
                                              touched,
                                              `experienceDetails.${index}.txtStartDate`
                                            ) &&
                                            getIn(
                                              errors,
                                              `experienceDetails.${index}.txtStartDate`
                                            )
                                          }
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name={`experienceDetails.${index}.txtStartDate`}
                                            value={
                                              values.experienceDetails[index]
                                                .txtStartDate
                                            }
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `experienceDetails.${index}.txtStartDate`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `experienceDetails.${index}.txtStartDate`
                                                )
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
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={
                                        values.experienceDetails[index]
                                          .txtEndDate
                                      }
                                      onChange={(newValue) => {
                                        setFieldValue(
                                          `experienceDetails.${index}.txtEndDate`,
                                          newValue
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <CustomField
                                          name={`experienceDetails.${index}.txtEndDate`}
                                          label="End Date"
                                          error={Boolean(
                                            getIn(
                                              touched,
                                              `experienceDetails.${index}.txtEndDate`
                                            ) &&
                                              getIn(
                                                errors,
                                                `experienceDetails.${index}.txtEndDate`
                                              )
                                          )}
                                          helperText={
                                            getIn(
                                              touched,
                                              `experienceDetails.${index}.txtEndDate`
                                            ) &&
                                            getIn(
                                              errors,
                                              `experienceDetails.${index}.txtEndDate`
                                            )
                                          }
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name={`experienceDetails.${index}.txtEndDate`}
                                            value={
                                              values.experienceDetails[index]
                                                .txtEndDate
                                            }
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `experienceDetails.${index}.txtEndDate`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `experienceDetails.${index}.txtEndDate`
                                                )
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Country"
                                    name={`experienceDetails.${index}.ddlCountry`}
                                    value={
                                      values.experienceDetails[index].ddlCountry
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
                                        `experienceDetails.${index}.ddlCountry`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.ddlCountry`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.ddlCountry`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.ddlCountry`
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
                                  <TextInput
                                    fullWidth
                                    label="City"
                                    name={`experienceDetails.${index}.txtCity`}
                                    value={
                                      values.experienceDetails[index].txtCity
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtCity`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.txtCity`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.txtCity`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.txtCity`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select State"
                                    name={`experienceDetails.${index}.ddlState`}
                                    value={
                                      values.experienceDetails[index].ddlState
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.ddlState`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.ddlState`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.ddlState`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.ddlState`
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
                                  <SelectInput
                                    label="Employment Type"
                                    name={`experienceDetails.${index}.ddlEmploymentType`}
                                    value={
                                      values.experienceDetails[index]
                                        .ddlEmploymentType
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.ddlEmploymentType`
                                      ) &&
                                        getIn(
                                          errors,
                                          `experienceDetails.${index}.ddlEmploymentType`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `experienceDetails.${index}.ddlEmploymentType`
                                      ) &&
                                      getIn(
                                        errors,
                                        `experienceDetails.${index}.ddlEmploymentType`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.employmentType.map(
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
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))}
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
      )}
    </Formik>
  );
};

export default EditExperienceDetails;
