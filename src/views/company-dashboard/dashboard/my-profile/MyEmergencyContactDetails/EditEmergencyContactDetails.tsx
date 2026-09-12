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
  employeeEmergencyContactDetails,
  // employeePersonalDetails,
  toastMessages
} from 'constants/appConstant';
import SessionContext from 'context/SessionContext';

import {
  EditEmployeeEmergencyContactDetailsFormValues
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
import {
  getEmployeeEmergencyContactDetailsByUserIdRequest,
  saveEmployeeEmergencyContactDetailRequest
} from 'services/company/employee/emergencyContactDetails';
import styles from './emergencyContact.style';

interface IEditEmergencyContactDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}
/**
 * Component to edit emergency contact information
 *
 * @component
 * @returns {JSX.Element}
 */
const EditEmergencyContactDetails = ({
  handleViewMode
}: IEditEmergencyContactDetailsProps): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [initialValues, setInitialValues] = useState<
    EditEmployeeEmergencyContactDetailsFormValues[]
  >([
    {
      txtId: null,
      txtContactName: '',
      txtContactAddress: '',
      ddlContactRelation: '',
      txtPhone: ''
    }
  ]);
  const [loading, setLoading] = useState(false);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    emergencyContactDetails: Yup.array()
      .of(
        Yup.object().shape({
          txtContactName: Yup.string()
            .required('Please enter the contact name.')
            .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabets'),
          // txtContactAddress: Yup.string().required(
          //   'Please enter the contact address.'
          // ),
          ddlContactRelation: Yup.string().required(
            'Please enter the contact relation.'
          ),
          txtPhone: Yup.string()
            .matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit phone number.'
            )
            .required('Please enter the phone number.')
        })
      )
      .min(1, 'Please add at least one emergency contact.')
  });

  const getEmployeeEmergencyContactDetails = async (): Promise<void> => {
    setLoading(true);
    const response = await getEmployeeEmergencyContactDetailsByUserIdRequest(
      Number(user?.id)
    );
    console.log('res is', response);
    const contactsData = response?.employeeEmergencyContacts;
    if (contactsData?.length) {
      const formattedContacts = contactsData.map((contact: any) => ({
        txtId: contact.id,
        txtContactName: contact.contact_name,
        txtContactAddress: contact.contact_address,
        ddlContactRelation: contact.contact_relation,
        txtPhone: contact.phone
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
      emergencyContactDetails: EditEmployeeEmergencyContactDetailsFormValues[];
    },
    { setSubmitting }: any
  ): Promise<void> => {
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      const requestData = values.emergencyContactDetails.map((contact) => {
        // Create base contact data
        const baseContact = {
          contactName: contact.txtContactName,
          contactAddress: contact.txtContactAddress,
          contactRelation: contact.ddlContactRelation,
          phone: contact.txtPhone,
          userId: user.id
        };

        // If id exists, include it in the object
        if (contact.txtId !== null) {
          return {
            ...baseContact,
            id: contact.txtId
          };
        }

        // Return base contact without id for new contacts
        return baseContact;
      });

      console.log('req data is', requestData);

      const response = await saveEmployeeEmergencyContactDetailRequest({
        emergencyContacts: requestData
      });

      if (response?.status.response_code === 200) {
        handleViewMode(false);
        showSnackbar(
          toastMessages.success.adminDashboard.employee
            .employeeEmergencyContactsUpdated,
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
      getEmployeeEmergencyContactDetails();
    }
  }, [user?.id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ emergencyContactDetails: initialValues }}
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
                subheader="Please update the details below to update emergency contact details."
                title="Edit Emergency Contact Details"
                sx={styles.cardHeaderEdit}
                titleTypographyProps={{ variant: 'h3', component: 'h3' }}
              />
              <Divider />
              {!loading ? (
                <CardContent>
                  <FieldArray name="emergencyContactDetails">
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
                              txtContactName: '',
                              txtContactAddress: '',
                              ddlContactRelation: '',
                              txtPhone: ''
                            })
                          }
                          sx={{ ml: 80, mb: 2 }}
                        >
                          Add Contact
                        </Button>
                        {values.emergencyContactDetails.map(
                          (contact, index) => (
                            <Accordion
                              key={index}
                              sx={{ mb: 2 }}
                              defaultExpanded
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`emergency-contact-${index}-content`}
                                id={`emergency-contact-${index}-header`}
                                sx={{
                                  backgroundColor: '#1976d2',
                                  color: 'white'
                                }}
                              >
                                <Grid container alignItems="center" spacing={2}>
                                  <Grid item xs={11}>
                                    <Typography variant="subtitle1">
                                      Emergency Contact #{index + 1}
                                      {contact.txtContactName &&
                                        ` - ${contact.txtContactName}`}
                                      {contact.ddlContactRelation &&
                                        ` (${contact.ddlContactRelation})`}
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
                                      label="Contact Name"
                                      name={`emergencyContactDetails.${index}.txtContactName`}
                                      value={
                                        values.emergencyContactDetails[index]
                                          .txtContactName
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtContactName`
                                        ) &&
                                          getIn(
                                            errors,
                                            `emergencyContactDetails.${index}.txtContactName`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtContactName`
                                        ) &&
                                        getIn(
                                          errors,
                                          `emergencyContactDetails.${index}.txtContactName`
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6}>
                                    <TextInput
                                      fullWidth
                                      label="Contact Address"
                                      name={`emergencyContactDetails.${index}.txtContactAddress`}
                                      multiline
                                      rows={1}
                                      value={
                                        values.emergencyContactDetails[index]
                                          .txtContactAddress
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtContactAddress`
                                        ) &&
                                          getIn(
                                            errors,
                                            `emergencyContactDetails.${index}.txtContactAddress`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtContactAddress`
                                        ) &&
                                        getIn(
                                          errors,
                                          `emergencyContactDetails.${index}.txtContactAddress`
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Contact Relation"
                                      name={`emergencyContactDetails.${index}.ddlContactRelation`}
                                      value={
                                        values.emergencyContactDetails[index]
                                          .ddlContactRelation
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.ddlContactRelation`
                                        ) &&
                                          getIn(
                                            errors,
                                            `emergencyContactDetails.${index}.ddlContactRelation`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.ddlContactRelation`
                                        ) &&
                                        getIn(
                                          errors,
                                          `emergencyContactDetails.${index}.ddlContactRelation`
                                        )
                                      }
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {employeeEmergencyContactDetails.contactRelation.map(
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
                                      label="Phone Number"
                                      name={`emergencyContactDetails.${index}.txtPhone`}
                                      type="number"
                                      value={
                                        values.emergencyContactDetails[index]
                                          .txtPhone
                                      }
                                      inputProps={{ maxLength: 10 }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtPhone`
                                        ) &&
                                          getIn(
                                            errors,
                                            `emergencyContactDetails.${index}.txtPhone`
                                          )
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `emergencyContactDetails.${index}.txtPhone`
                                        ) &&
                                        getIn(
                                          errors,
                                          `emergencyContactDetails.${index}.txtPhone`
                                        )
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          )
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
      )}
    </Formik>
  );
};

export default EditEmergencyContactDetails;
