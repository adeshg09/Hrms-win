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
  // TextField,
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
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* Relative Imports */
import useSnackbarClose from 'hooks/useSnackbarClose';
import {
  // countries,
  // employeeEducationDetails,
  // employeeEmergencyContactDetails,
  employeeFamilyDetails,
  // employeePersonalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  // EditEmployeeEducationDetailsFormValues,
  // EditEmployeeEmergencyContactDetailsFormValues,
  EditEmployeeFamilyDetailsFormValues
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
import {
  getEmployeeFamilyDetailsByUserIdRequest,
  saveEmployeeFamilyDetailRequest
} from 'services/company/employee/familyDetails';
import styles from './family.style';

interface IEditEducationDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit family information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditFamilyDetails = ({
  handleViewMode
}: IEditEducationDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeFamilyDetailsFormValues[]
  >([
    {
      txtId: null,
      ddlRelationType: '',
      txtName: '',
      txtAge: '',
      txtBirthDate: '',
      txtCurrentAddress: '',
      ddlBirthCountry: '',
      ddlBirthState: '',
      txtBirthLocation: '',
      txtOccupation: '',
      txtPhone: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    familyDetails: Yup.array()
      .of(
        Yup.object().shape({
          ddlRelationType: Yup.string().required(
            'Please select the relation type.'
          ),
          txtName: Yup.string()
            .required('Please enter the name.')
            .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabets'),
          txtOccupation: Yup.string().matches(
            /^[a-zA-Z ]+$/,
            'Please enter only alphabets'
          ),
          txtPhone: Yup.string()
            .matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit phone number.'
            )
            .required('Please Enter a Phone Number')
        })
      )
      .min(1, 'Please add at least one family member.')
  });
  /**
   * function to handle country change
   * @return {void}
   */
  // const handleCountryChange = (countryCode: string): void => {
  //   const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
  //   console.log('selected country', selectedCountry);
  //   setStates(selectedCountry ? selectedCountry.states : []);
  // };

  const getEmployeeFamilyDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeFamilyDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const familyData = response?.employeeFamilyDetails;
    if (familyData?.length) {
      setInitialValues(
        familyData.map((family: any) => ({
          txtId: family.id,
          ddlRelationType: family.relation_type,
          txtName: family.name,
          txtOccupation: family.occupation,
          txtPhone: family.phone
        }))
      );
      setLoading(false);
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
      familyDetails: EditEmployeeFamilyDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.familyDetails.map((detail) => {
        // Create base contact data
        const baseContact = {
          relationType: detail.ddlRelationType,
          name: detail.txtName,
          age: detail.txtAge,
          birthDate: detail.txtBirthDate,
          currentAddress: detail.txtCurrentAddress,
          birthCountry: detail.ddlBirthCountry,
          birthState: detail.ddlBirthState,
          birthLocation: detail.txtBirthLocation,
          occupation: detail.txtOccupation,
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

      const response = await saveEmployeeFamilyDetailRequest({
        familyDetails: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeFamilyDetailsUpdated,
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
    console.log('states are', states);
    console.log('initial are', initialValues);
    if (user?.id) {
      getEmployeeFamilyDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ familyDetails: initialValues }}
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
        // setFieldValue
      }) => (
        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Box>
            <Card sx={styles.profileCard}>
              <CardHeader
                subheader="Please update the details below to update family details."
                title="Edit Family Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <FieldArray name="familyDetails">
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
                              ddlRelationType: '',
                              txtName: '',
                              txtOccupation: '',
                              txtPhone: ''
                            })
                          }
                          sx={{ ml: 100, mb: 2 }}
                        >
                          Add Member
                        </Button>
                        {values.familyDetails.map((member, index) => (
                          <Accordion key={index} sx={{ mb: 2 }} defaultExpanded>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`family-member-${index}-content`}
                              id={`family-member-${index}-header`}
                              sx={{
                                backgroundColor: '#1976d2',
                                color: 'white'
                              }}
                            >
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={11}>
                                  <Typography variant="subtitle1">
                                    Family Member #{index + 1}
                                    {member.txtName && ` - ${member.txtName}`}
                                    {member.ddlRelationType &&
                                      ` (${member.ddlRelationType})`}
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
                                    label="Select Relation Type"
                                    name={`familyDetails.${index}.ddlRelationType`}
                                    value={
                                      values.familyDetails[index]
                                        .ddlRelationType
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.ddlRelationType`
                                      ) &&
                                        getIn(
                                          errors,
                                          `familyDetails.${index}.ddlRelationType`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.ddlRelationType`
                                      ) &&
                                      getIn(
                                        errors,
                                        `familyDetails.${index}.ddlRelationType`
                                      )
                                    }
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeFamilyDetails.relationType.map(
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
                                    label="Name"
                                    name={`familyDetails.${index}.txtName`}
                                    value={values.familyDetails[index].txtName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtName`
                                      ) &&
                                        getIn(
                                          errors,
                                          `familyDetails.${index}.txtName`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtName`
                                      ) &&
                                      getIn(
                                        errors,
                                        `familyDetails.${index}.txtName`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Occupation"
                                    name={`familyDetails.${index}.txtOccupation`}
                                    value={
                                      values.familyDetails[index].txtOccupation
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtOccupation`
                                      ) &&
                                        getIn(
                                          errors,
                                          `familyDetails.${index}.txtOccupation`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtOccupation`
                                      ) &&
                                      getIn(
                                        errors,
                                        `familyDetails.${index}.txtOccupation`
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Phone"
                                    name={`familyDetails.${index}.txtPhone`}
                                    type="number"
                                    value={values.familyDetails[index].txtPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtPhone`
                                      ) &&
                                        getIn(
                                          errors,
                                          `familyDetails.${index}.txtPhone`
                                        )
                                    )}
                                    helperText={
                                      getIn(
                                        touched,
                                        `familyDetails.${index}.txtPhone`
                                      ) &&
                                      getIn(
                                        errors,
                                        `familyDetails.${index}.txtPhone`
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

export default EditFamilyDetails;
