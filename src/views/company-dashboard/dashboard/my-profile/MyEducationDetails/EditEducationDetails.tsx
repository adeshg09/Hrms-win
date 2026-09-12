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
  // countries,
  employeeEducationDetails,
  // employeeEmergencyContactDetails,
  // employeePersonalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  EditEmployeeEducationDetailsFormValues
  // EditEmployeeEmergencyContactDetailsFormValues,
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
import {
  getEmployeeEducationDetailsByUserIdRequest,
  saveEmployeeEducationDetailRequest
} from 'services/company/employee/educationDetails';
import dayjs from 'dayjs';
import styles from './education.style';

interface IEditEducationDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit emergency contact information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditEducationDetails = ({
  handleViewMode
}: IEditEducationDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeEducationDetailsFormValues[]
  >([
    {
      txtId: null,
      ddlCourse: '',
      txtDegreeSpecialization: '',
      txtInstituteName: '',
      txtFromDate: '',
      txtToDate: '',
      ddlStatus: '',
      ddlStudyMode: '',
      txtPercentage: ''
    }
  ]);
  const [loading, setLoading] = useState(false);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    educationDetails: Yup.array()
      .of(
        Yup.object().shape({
          ddlCourse: Yup.string().required('Please select the course.'),
          txtDegreeSpecialization: Yup.string()
            .required('Please enter the degree specialization.')
            .matches(
              /^[a-zA-Z\s\-.,()&]+$/,
              'Please enter a valid degree specialization (letters and common special characters only)'
            ),
          txtInstituteName: Yup.string().required(
            'Please enter the institute name.'
          ),
          // .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabets'),
          txtFromDate: Yup.date()
            .required('Please enter the from date.')
            .max(new Date(), 'From date cannot be in the future.'),
          txtToDate: Yup.date()
            .min(Yup.ref('txtFromDate'), 'To date must be after from date.')
            .required('Please enter the to date.'),
          ddlStatus: Yup.string().required('Please select the status.'),
          ddlStudyMode: Yup.string().required('Please select the study mode.'),
          txtPercentage: Yup.number()
            .required('Please enter the percentage.')
            .typeError('Must be a number (e.g., 85.5)')
            .min(0, 'Cannot be less than 0')
            .max(100, 'Cannot exceed 100')
        })
      )
      .min(1, 'Please add at least one education record.')
  });

  const getEmployeeEducationDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeEducationDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const educationData = response?.employeeEducationalDetails;
    if (educationData?.length) {
      const formattedContacts = educationData.map((education: any) => ({
        txtId: education.id,
        ddlCourse: education.course,
        txtDegreeSpecialization: education.degree_specialization,
        txtInstituteName: education.institute_name,
        txtFromDate: education.from_date,
        txtToDate: education.to_date,
        ddlStatus: education.status,
        ddlStudyMode: education.study_mode,
        txtPercentage: education.percentage
      }));
      setInitialValues(formattedContacts);
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
    values: {
      educationDetails: EditEmployeeEducationDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.educationDetails.map((detail) => {
        // Create base contact data
        const baseContact = {
          course: detail.ddlCourse,
          degreeSpecialization: detail.txtDegreeSpecialization,
          instituteName: detail.txtInstituteName,
          fromDate: detail.txtFromDate,
          toDate: detail.txtToDate,
          status: detail.ddlStatus,
          studyMode: detail.ddlStudyMode,
          percentage: detail.txtPercentage,
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

      const response = await saveEmployeeEducationDetailRequest({
        educationalDetails: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeEducationDetailsUpdated,
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
      getEmployeeEducationDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ educationDetails: initialValues }}
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
                subheader="Please update the details below to update education details."
                title="Edit Education Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <FieldArray name="educationDetails">
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
                              ddlCourse: '',
                              txtDegreeSpecialization: '',
                              txtInstituteName: '',
                              txtFromDate: '',
                              txtToDate: '',
                              ddlStatus: '',
                              ddlStudyMode: '',
                              txtPercentage: ''
                            })
                          }
                          sx={{ ml: 80, mb: 2 }}
                        >
                          Add Education
                        </Button>
                        {values.educationDetails.map((education, index) => (
                          <Accordion key={index} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`education-${index}-content`}
                              id={`education-${index}-header`}
                              sx={{
                                backgroundColor: '#1976d2',
                                color: 'white'
                              }}
                            >
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={11}>
                                  <Typography variant="subtitle1">
                                    Education #{index + 1}
                                    {education.ddlCourse &&
                                      ` - ${education.ddlCourse}`}
                                    {education.txtDegreeSpecialization &&
                                      ` (${education.txtDegreeSpecialization})`}
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
                                  <SelectInput
                                    label="Course"
                                    name={`educationDetails.${index}.ddlCourse`}
                                    value={
                                      values.educationDetails[index].ddlCourse
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlCourse`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.ddlCourse`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlCourse`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.ddlCourse`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeEducationDetails.course.map(
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
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Degree Specialization"
                                    name={`educationDetails.${index}.txtDegreeSpecialization`}
                                    value={
                                      values.educationDetails[index]
                                        .txtDegreeSpecialization
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtDegreeSpecialization`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.txtDegreeSpecialization`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtDegreeSpecialization`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.txtDegreeSpecialization`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Institute Name"
                                    name={`educationDetails.${index}.txtInstituteName`}
                                    value={
                                      values.educationDetails[index]
                                        .txtInstituteName
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtInstituteName`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.txtInstituteName`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtInstituteName`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.txtInstituteName`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="month"
                                      views={['year', 'month']}
                                      inputFormat="MM/YYYY"
                                      value={dayjs(
                                        values.educationDetails[index]
                                          .txtFromDate
                                      )}
                                      onChange={(
                                        newValue: dayjs.Dayjs | null
                                      ) => {
                                        const dateWithFirstDay = newValue
                                          ? newValue.startOf('month')
                                          : null;
                                        setFieldValue(
                                          `educationDetails.${index}.txtFromDate`,
                                          dateWithFirstDay
                                            ? dateWithFirstDay.format(
                                                'YYYY-MM-DD'
                                              )
                                            : null
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <CustomField
                                          name={`educationDetails.${index}.txtFromDate`}
                                          label="From Date"
                                          error={Boolean(
                                            getIn(
                                              touched,
                                              `educationDetails.${index}.txtFromDate`
                                            ) &&
                                              getIn(
                                                errors,
                                                `educationDetails.${index}.txtFromDate`
                                              )
                                          )}
                                          helperText={
                                            getIn(
                                              touched,
                                              `educationDetails.${index}.txtFromDate`
                                            ) &&
                                            getIn(
                                              errors,
                                              `educationDetails.${index}.txtFromDate`
                                            )
                                          }
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name={`educationDetails.${index}.txtFromDate`}
                                            value={
                                              values.educationDetails[index]
                                                .txtFromDate
                                            }
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `educationDetails.${index}.txtFromDate`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `educationDetails.${index}.txtFromDate`
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
                                      openTo="month"
                                      views={['year', 'month']}
                                      inputFormat="MM/YYYY"
                                      value={
                                        values.educationDetails[index].txtToDate
                                          ? dayjs(
                                              values.educationDetails[index]
                                                .txtToDate
                                            )
                                          : null
                                      }
                                      onChange={(
                                        newValue: dayjs.Dayjs | null
                                      ) => {
                                        // Set to first day of the month when month/year is selected
                                        const dateWithFirstDay = newValue
                                          ? newValue.startOf('month')
                                          : null;
                                        setFieldValue(
                                          `educationDetails.${index}.txtToDate`,
                                          dateWithFirstDay
                                            ? dateWithFirstDay.format(
                                                'YYYY-MM-DD'
                                              )
                                            : null
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <CustomField
                                          name={`educationDetails.${index}.txtToDate`}
                                          label="To Date"
                                          error={Boolean(
                                            getIn(
                                              touched,
                                              `educationDetails.${index}.txtToDate`
                                            ) &&
                                              getIn(
                                                errors,
                                                `educationDetails.${index}.txtToDate`
                                              )
                                          )}
                                          helperText={
                                            getIn(
                                              touched,
                                              `educationDetails.${index}.txtToDate`
                                            ) &&
                                            getIn(
                                              errors,
                                              `educationDetails.${index}.txtToDate`
                                            )
                                          }
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name={`educationDetails.${index}.txtToDate`}
                                            value={
                                              values.educationDetails[index]
                                                .txtToDate
                                            }
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `educationDetails.${index}.txtToDate`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `educationDetails.${index}.txtToDate`
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
                                    label="Status"
                                    name={`educationDetails.${index}.ddlStatus`}
                                    value={
                                      values.educationDetails[index].ddlStatus
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlStatus`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.ddlStatus`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlStatus`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.ddlStatus`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeEducationDetails.status.map(
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
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Study Mode"
                                    name={`educationDetails.${index}.ddlStudyMode`}
                                    value={
                                      values.educationDetails[index]
                                        .ddlStudyMode
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlStudyMode`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.ddlStudyMode`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.ddlStudyMode`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.ddlStudyMode`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeEducationDetails.studyMode.map(
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
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="GPA/Score"
                                    name={`educationDetails.${index}.txtPercentage`}
                                    type="number"
                                    value={
                                      values.educationDetails[index]
                                        .txtPercentage
                                    }
                                    inputProps={{
                                      min: 0,
                                      max: 100,
                                      step: 'any'
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtPercentage`
                                      ) &&
                                        getIn(
                                          errors,
                                          `educationDetails.${index}.txtPercentage`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `educationDetails.${index}.txtPercentage`
                                      ) &&
                                      getIn(
                                        errors,
                                        `educationDetails.${index}.txtPercentage`
                                      )
                                    }
                                  />
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

export default EditEducationDetails;
