/* Imports */
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldArray, Form, Formik, FormikHelpers, getIn } from 'formik';
import * as Yup from 'yup';
// import moment from 'moment';
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
  // FormHelperText,
  Checkbox,
  StepConnector,
  // Card,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  stepConnectorClasses
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/* Relative Imports */
import {
  PAGE_COMPANY_DASHBOARD,
  PAGE_SUBMODULE_COMPANY_DASHBOARD
} from 'routes/paths';
import SessionContext from 'context/SessionContext';
import useSnackbarClose from 'hooks/useSnackbarClose';
import Loader from 'components/Loader';
import {
  AddEmployeeAddressDetailsFormValues,
  AddEmployeeDetailsFormValues,
  AddEmployeeDocumentsFormValues,
  AddEmployeeEducationDetailsFormValues,
  AddEmployeeEmergencyContactDetailsFormValues,
  AddEmployeeExperienceDetailsFormValues,
  AddEmployeeFamilyDetailsFormValues,
  AddEmployeePersonalDetailsFormValues,
  AddEmployeeProfessionalDetailsFormValues,
  AddUserFormValues
} from 'models/company/employee';
import {
  RoleModel,
  ShortDesignationModel,
  ShortRoleModel,
  UserProfileModel
} from 'models/company';
import {
  countries,
  // employeeAddressDetails,
  employeeEducationDetails,
  employeeEmergencyContactDetails,
  employeeFamilyDetails,
  employeePersonalDetails,
  employeeProfessionalDetails,
  toastMessages
} from 'constants/appConstant';
import { getDesignationsRequest } from 'services/company/designation';
import {
  insertEmployeePersonalDetailRequest,
  updateEmployeePersonalDetailRequest
} from 'services/company/employee/personalDetails';
import { AdminDashboardPage } from 'components/Page';
import {
  getUsersRequest,
  registerUserRequest,
  updateUserRequest
} from 'services/company/employee/accountSetup';
import {
  insertEmployeeProfessionalDetailRequest,
  updateEmployeeProfessionalDetailRequest
} from 'services/company/employee/professionalDetails';
import {
  // insertEmployeeFamilyDetailRequest,
  saveEmployeeFamilyDetailRequest
  // updateEmployeeFamilyDetailRequest
} from 'services/company/employee/familyDetails';
import {
  // insertEmployeeEmergencyContactDetailRequest,
  saveEmployeeEmergencyContactDetailRequest
  // updateEmployeeEmergencyContactDetailRequest
} from 'services/company/employee/emergencyContactDetails';
import {
  // deleteEmployeeAddressDetailRequest,
  // insertEmployeeAddressDetailRequest,
  saveEmployeeAddressDetailRequest
  // updateEmployeeAddressDetailRequest
} from 'services/company/employee/addressDetails';
import {
  // insertEmployeeEducationalDetailRequest,
  saveEmployeeEducationDetailRequest
  // updateEmployeeEducationalDetailRequest
} from 'services/company/employee/educationDetails';
import {
  // insertEmployeeExperienceDetailRequest,
  SaveEmployeeExperienceDetails
  // updateEmployeeExperienceDetailRequest
} from 'services/company/employee/experienceDetails';
import { AdminFormLayout } from 'components/CardLayout';
import {
  AutoCompleteInput,
  CustomField,
  SelectInput,
  TextInput
} from 'components/InputFields';
import { getRolesRequest } from 'services/company/role';
import dayjs from 'dayjs';

/* Local Imports */

import { getDate } from 'utility/formatDate';
import { ALLOWED_FILE_FORMATS } from 'components/InputFields/upload/UploadSingleFile';
import { DocumentModel } from 'models/company/DocumentType';
import { getDocumentType } from 'services/company/employee/documentTypeDetails';
// import { calculateAge } from 'utility/calculateAge';
import adminStyle from '../../company.style';
import DocumentUploadStep from './DocumentUploadStep';
import PopupAddDesignation from './components/PopupAddDesignation';
import PopupAddDocument from './components/PopupAddDocument';

/* Constants */
const manageEmployeePath = PAGE_COMPANY_DASHBOARD.employees.absolutePath;

const stepsWithoutEmployeeManagementSubModulePresent = [
  'Professional Details'
  // 'Professional Details'
];
const stepsWithEmployeeManagementSubModulePresent = [
  ...stepsWithoutEmployeeManagementSubModulePresent,
  'Personal Details',
  'Address Details',
  'Family',
  'Education',
  'Emergency Contacts',
  'Experience',
  'Document'
];

interface SavedStepData {
  data: any;
  ids?: number[] | number;
}

const CreateEmployee = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [states, setStates] = useState<string[] | []>([]);
  const [designations, setDesignations] = useState<
    Array<ShortDesignationModel>
  >([]);
  const [roles, setRoles] = useState<Array<RoleModel>>([]);
  const [users, setUsers] = useState<Array<UserProfileModel>>([]);
  const [documentTypes, setDocumentTypes] = useState<Array<DocumentModel>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<{
    [key: number]: boolean;
  }>({});
  const [savedStepData, setSavedStepData] = useState<{
    [key: number]: SavedStepData;
  }>({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);

  /* Constants */
  const initialValuesCreateUser = {
    txtFirstName: '',
    txtLastName: '',
    txtEmail: '',
    txtPassword: '',
    ddlRoles: [],
    chkIsActive: true,
    chkShowActivity: true
  } as AddUserFormValues;

  const initialValuesPersonalDetails = {
    txtBirthDate: '',
    txtAge: null,
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
  } as AddEmployeePersonalDetailsFormValues;

  const initialValuesProfessionalDetails = {
    txtEmployeeCode: '',
    ddlDesignation: '',
    ddlReportingUser: '',
    txtJoinDate: '',
    ddlEmploymentType: '',
    ddlWorkingType: ''
  } as AddEmployeeProfessionalDetailsFormValues;

  const initialValuesAddressDetailsEntries = {
    ddlAddressType: '',
    txtBuildingName: '',
    txtFlatNumber: '',
    txtStreetName: '',
    txtLandmark: '',
    txtCity: '',
    ddlCountry: '',
    ddlState: '',
    txtPincode: '',
    txtPhone: ''
  } as AddEmployeeAddressDetailsFormValues;

  const initialValuesFamilyDetailsEntries = {
    ddlRelationType: '',
    txtName: '',
    txtOccupation: '',
    txtPhone: ''
  } as AddEmployeeFamilyDetailsFormValues;

  const initialValuesEducationDetailsEntries = {
    ddlCourse: '',
    txtDegreeSpecialization: '',
    txtInstituteName: '',
    txtFromDate: '',
    txtToDate: '',
    ddlStatus: '',
    ddlStudyMode: '',
    txtPercentage: ''
  } as AddEmployeeEducationDetailsFormValues;

  const initialValuesEmergencyContactDetailsEntries = {
    txtContactName: '',
    txtContactAddress: '',
    ddlContactRelation: '',
    txtPhone: ''
  } as AddEmployeeEmergencyContactDetailsFormValues;

  const initialValuesExperienceDetailsEntries = {
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
  } as AddEmployeeExperienceDetailsFormValues;

  const initialValuesDocumentDetailsEntries = {
    documentTypeId: 0,
    employeeDocument: ''
  } as AddEmployeeDocumentsFormValues;

  const initialValues: AddEmployeeDetailsFormValues = {
    ...initialValuesCreateUser,
    ...initialValuesPersonalDetails,
    ...initialValuesProfessionalDetails,
    addressDetails: [
      { ...initialValuesAddressDetailsEntries, ddlAddressType: 'present' },
      { ...initialValuesAddressDetailsEntries, ddlAddressType: 'permanent' }
    ],
    familyDetails: [initialValuesFamilyDetailsEntries],
    educationDetails: [initialValuesEducationDetailsEntries],
    emergencyContactDetails: [initialValuesEmergencyContactDetailsEntries],
    experienceDetails: [initialValuesExperienceDetailsEntries],
    documentDetails: [initialValuesDocumentDetailsEntries]
  };
  const isEmployeeSubModulePresent = user?.companySubModules?.includes(
    PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
  );
  const steps = isEmployeeSubModulePresent
    ? stepsWithEmployeeManagementSubModulePresent
    : stepsWithoutEmployeeManagementSubModulePresent;
  const isLastStep = activeStep === steps.length - 1;
  // const isFirstStep = activeStep === 0;

  /* Functions */
  /**
   * function to go back
   * @return {void}
   */
  const handleBack = (): void => {
    if (activeStep === 0) {
      navigate(manageEmployeePath);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStepClick = (step: number): any => {
    if (completedSteps[0]) {
      setActiveStep(step);
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
   * function to get all the designation with backend action
   * @return {void}
   */
  const handleGetDesignations = async (): Promise<void> => {
    try {
      const response = await getDesignationsRequest();
      if (response && response.status.response_code === 200) {
        setDesignations(response.designations);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /**
   * function to get all the roles with backend action
   * @returns {void}
   */
  const handleGetRoles = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getRolesRequest();
      if (response && response.status.response_code === 200) {
        setRoles(response.roles);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the employees with backend action
   *
   * @returns {void}
   */
  const handleGetEmployees = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUsersRequest();
      console.log('users are', response);
      if (response?.status.response_code === 200) {
        setUsers(response?.users || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get all the available document types with backend action
   * @returns {void}
   */
  const handleGetDocumentTypes = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getDocumentType();
      if (response && response.status.response_code === 200) {
        setDocumentTypes(response.documentTypes);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  // const handleDeleteAddress = async (index: number): Promise<void> => {
  //   try {
  //     const addressId = savedStepData[3]?.ids[index];
  //     if (addressId) {
  //       const response = await deleteEmployeeAddressDetailRequest(addressId);
  //       if (response?.status.response_code === 200) {
  //         // Remove the address from the form values
  //         const newAddressDetails = [...values.addressDetails];
  //         newAddressDetails.splice(index, 1);
  //         setFieldValue('addressDetails', newAddressDetails);

  //         // Update the savedStepData
  //         const newIds = [...(savedStepData[3]?.ids || [])];
  //         newIds.splice(index, 1);
  //         setSavedStepData((prev) => ({
  //           ...prev,
  //           3: { ...prev[3], ids: newIds }
  //         }));

  //         showSnackbar('Address deleted successfully', 'success');
  //       } else {
  //         showSnackbar('Failed to delete address', 'error');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error deleting address:', error);
  //     showSnackbar('An error occurred while deleting the address', 'error');
  //   }
  // };

  // const isEqual = (obj1: any, obj2: any): boolean => {
  //   // Handle null/undefined cases
  //   if (obj1 === obj2) return true;
  //   if (!obj1 || !obj2) return false;

  //   // Normalize arrays (especially for roleIds)
  //   if (Array.isArray(obj1) && Array.isArray(obj2)) {
  //     if (obj1.length !== obj2.length) return false;
  //     return obj1.every((item, index) => isEqual(item, obj2[index]));
  //   }

  //   // Handle object comparison
  //   if (typeof obj1 === 'object' && typeof obj2 === 'object') {
  //     const keys1 = Object.keys(obj1).filter((key) => obj1[key] !== undefined);
  //     const keys2 = Object.keys(obj2).filter((key) => obj2[key] !== undefined);

  //     // Check if object has prototype properties that need to be ignored
  //     if (keys1.includes('[[Prototype]]') || keys2.includes('[[Prototype]]')) {
  //       return true;
  //     }

  //     if (keys1.length !== keys2.length) return false;

  //     return keys1.every((key) => {
  //       // Special handling for roleIds
  //       if (key === 'roleIds') {
  //         const roles1 =
  //           typeof obj1[key] === 'string' ? JSON.parse(obj1[key]) : obj1[key];
  //         const roles2 =
  //           typeof obj2[key] === 'string' ? JSON.parse(obj2[key]) : obj2[key];
  //         return isEqual(roles1, roles2);
  //       }
  //       return isEqual(obj1[key], obj2[key]);
  //     });
  //   }

  //   // Handle primitive values
  //   return obj1 === obj2;
  // };

  // const getStepData = (
  //   values: AddEmployeeDetailsFormValues,
  //   step: number
  // ): any => {
  //   switch (step) {
  //     case 0:
  //       return {
  //         txtFirstName: values.txtFirstName,
  //         txtLastName: values.txtLastName,
  //         txtEmail: values.txtEmail,
  //         txtPassword: values.txtPassword,
  //         ddlRoles: values.ddlRoles,
  //         chkIsActive: values.chkIsActive,
  //         chkShowActivity: values.chkShowActivity
  //       };
  //     case 1:
  //       return {
  //         txtBirthDate: values.txtBirthDate,
  //         txtAge: values.txtAge,
  //         ddlBirthCountry: values.ddlBirthCountry,
  //         ddlBirthState: values.ddlBirthState,
  //         txtBirthLocation: values.txtBirthLocation,
  //         ddlGender: values.ddlGender,
  //         ddlMaritalStatus: values.ddlMaritalStatus,
  //         txtMarriageDate: values.txtMarriageDate,
  //         ddlBloodGroup: values.ddlBloodGroup,
  //         txtPanNumber: values.txtPanNumber,
  //         txtCaste: values.txtCaste,
  //         txtReligion: values.txtReligion,
  //         txtResidence: values.txtResidence
  //       };
  //     case 2:
  //       return {
  //         txtEmployeeCode: values.txtEmployeeCode,
  //         ddlDesignation: values.ddlDesignation,
  //         txtJoinDate: values.txtJoinDate,
  //         ddlEmploymentType: values.ddlEmploymentType,
  //         ddlWorkingType: values.ddlWorkingType
  //       };
  //     case 3:
  //       return { addressDetails: values.addressDetails };
  //     case 4:
  //       return { familyDetails: values.familyDetails };
  //     case 5:
  //       return { educationDetails: values.educationDetails };
  //     case 6:
  //       return { emergencyContactDetails: values.emergencyContactDetails };
  //     case 7:
  //       return { experienceDetails: values.experienceDetails };
  //     case 8:
  //       return { documentDetails: values.documentDetails };
  //     default:
  //       return {};
  //   }
  // };

  // Helper function to normalize keys for comparison
  // const normalizeKeys = (obj: any): any => {
  //   const normalized: any = {};

  //   Object.keys(obj).forEach((key) => {
  //     // Remove 'txt', 'ddl', 'chk' prefixes
  //     let normalizedKey =
  //       key
  //         .replace(/^txt/, '')
  //         .replace(/^ddl/, '')
  //         .replace(/^chk/, '')
  //         // Convert to camelCase if it isn't already
  //         .charAt(0)
  //         .toLowerCase() + key.slice(1);

  //     // Special case for roleIds
  //     if (normalizedKey === 'roles') normalizedKey = 'roleIds';

  //     normalized[normalizedKey] = obj[key];
  //   });

  //   return normalized;
  // };

  /**
   * Submit function to save Employee Details based on Details type with backend action
   * @param {AddEmployeeDetailsFormValues} values - input values of form
   * @param {object} {setSubmitting} - function to check submission
   * @return {void}
   */

  const handleFormSubmit = async (
    values: AddEmployeeDetailsFormValues,
    { setSubmitting }: FormikHelpers<AddEmployeeDetailsFormValues>
  ): Promise<void> => {
    try {
      let response: any;

      if (activeStep === 0) {
        const requestDataUserForm: any = {
          firstName: values.txtFirstName,
          lastName: values.txtLastName,
          email: values.txtEmail,
          password: values.txtPassword,
          phone: values.txtPhone,
          roleIds: JSON.stringify(values.ddlRoles),
          isActive: values.chkIsActive,
          showActivity: values.chkShowActivity
        };

        if (completedSteps[0]) {
          response = await updateUserRequest(userId, requestDataUserForm, true);
        } else {
          response = await registerUserRequest(requestDataUserForm);
        }
        let newUserId;
        if (response?.status.response_code === 200) {
          if (!completedSteps[0]) {
            setUserId(response.id);
          }
          newUserId = response?.id;
          setSavedStepData((prev) => ({
            ...prev,
            0: { data: requestDataUserForm, ids: response.id }
          }));
          setCompletedSteps((prev) => ({ ...prev, 0: true }));
          setSavedStepData((prev) => ({ ...prev, 0: requestDataUserForm }));
          // setActiveStep(activeStep + 1);
          // setSubmitting(false);
          // showSnackbar(
          //   completedSteps[0]
          //     ? toastMessages.success.adminDashboard.userUpdated
          //     : toastMessages.success.adminDashboard.userSaved,
          //   'success'
          // );
        } else if (response?.status.response_code === 205) {
          showSnackbar(
            toastMessages.error.adminDashboard.userDuplicate,
            'error'
          );
        } else if (response?.status.response_code === 209) {
          showSnackbar(
            toastMessages.error.adminDashboard.companyUserExceed,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
        // if (completedSteps[0]) {
        const requestDataProfessionalDetails: any = {
          employeeCode: values.txtEmployeeCode,
          designationId: values.ddlDesignation,
          reportingUserId: values.ddlReportingUser,
          joiningDate: values.txtJoinDate,
          employmentType: values.ddlEmploymentType,
          workingType: values.ddlWorkingType
        };
        if (completedSteps[9]) {
          response = await updateEmployeeProfessionalDetailRequest(
            // Number(savedStepData[0]?.ids),
            userId,
            requestDataProfessionalDetails
          );
        } else {
          console.log('userId', userId);
          requestDataProfessionalDetails.userId = newUserId;
          response = await insertEmployeeProfessionalDetailRequest(
            requestDataProfessionalDetails
          );
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 9: true }));
          // setSavedStepData((prev) => ({
          //   ...prev,
          //   1: { data: requestDataProfessionalDetails, ids: response.id }
          // }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[0]
              ? toastMessages.success.adminDashboard.userUpdated
              : toastMessages.success.adminDashboard.userSaved,
            'success'
          );
        }
        // }
      } else if (activeStep === 1) {
        const requestDataEmployeePersonalDetails: any = {
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
          requestDataEmployeePersonalDetails.marriageDate =
            values.txtMarriageDate;
        }

        if (completedSteps[1]) {
          console.log('id is', savedStepData[1]?.ids);
          response = await updateEmployeePersonalDetailRequest(
            savedStepData[1]?.ids,
            requestDataEmployeePersonalDetails
          );
        } else {
          requestDataEmployeePersonalDetails.userId = userId;
          response = await insertEmployeePersonalDetailRequest(
            requestDataEmployeePersonalDetails
          );
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 1: true }));
          setSavedStepData((prev) => ({
            ...prev,
            1: { data: requestDataEmployeePersonalDetails, ids: response.id }
          }));
          console.log('saved step data', savedStepData);
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[1]
              ? toastMessages.success.adminDashboard.employee
                  .employeePersonalDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeePersonalDetailsSaved,
            'success'
          );
        }
      }
      // else if (activeStep === 1) {
      //   const requestDataProfessionalDetails: any = {
      //     employeeCode: values.txtEmployeeCode,
      //     designationId: values.ddlDesignation,
      //     reportingUserId: values.ddlReportingUser,
      //     joiningDate: values.txtJoinDate,
      //     employmentType: values.ddlEmploymentType,
      //     workingType: values.ddlWorkingType
      //   };

      //   if (completedSteps[1]) {
      //     response = await updateEmployeeProfessionalDetailRequest(
      //       Number(savedStepData[1]?.ids),
      //       requestDataProfessionalDetails
      //     );
      //   } else {
      //     requestDataProfessionalDetails.userId = userId;
      //     response = await insertEmployeeProfessionalDetailRequest(
      //       requestDataProfessionalDetails
      //     );
      //   }

      //   if (response?.status.response_code === 200) {
      //     setCompletedSteps((prev) => ({ ...prev, 1: true }));
      //     setSavedStepData((prev) => ({
      //       ...prev,
      //       1: { data: requestDataProfessionalDetails, ids: response.id }
      //     }));
      //     setActiveStep(activeStep + 1);
      //     setSubmitting(false);
      //     showSnackbar(
      //       completedSteps[1]
      //         ? toastMessages.success.adminDashboard.employee
      //             .employeeProfessionalDetailsUpdated
      //         : toastMessages.success.adminDashboard.employee
      //             .employeeProfessionalDetailsSaved,
      //       'success'
      //     );
      //   }
      // }
      else if (activeStep === 3) {
        const reqDataFamilyDetails = values.familyDetails.map((detail) => ({
          relationType: detail.ddlRelationType,
          name: detail.txtName,
          occupation: detail.txtOccupation,
          phone: detail.txtPhone,
          userId
        }));

        // For update operation, we need to include the ids from savedStepData
        if (completedSteps[3] && savedStepData[3]?.ids) {
          const savedIds = savedStepData[3].ids as number[];

          // Map the existing ids to the family details
          const familyDetailsWithIds = reqDataFamilyDetails.map(
            (detail, index) => ({
              ...detail,
              id: savedIds[index] // Add the id from saved data
            })
          );

          response = await saveEmployeeFamilyDetailRequest({
            familyDetails: familyDetailsWithIds
          });
        } else {
          // For insert, just send the data without ids
          response = await saveEmployeeFamilyDetailRequest({
            familyDetails: reqDataFamilyDetails
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 3: true }));
          setSavedStepData((prev) => ({
            ...prev,
            3: { data: reqDataFamilyDetails, ids: response.ids }
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[3]
              ? toastMessages.success.adminDashboard.employee
                  .employeeFamilyDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeFamilyDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 4) {
        const requestDataEducationDetails = values.educationDetails.map(
          (detail) => ({
            course: detail.ddlCourse,
            degreeSpecialization: detail.txtDegreeSpecialization,
            instituteName: detail.txtInstituteName,
            fromDate: detail.txtFromDate,
            toDate: detail.txtToDate,
            status: detail.ddlStatus,
            studyMode: detail.ddlStudyMode,
            percentage: detail.txtPercentage,
            userId
          })
        );

        if (completedSteps[4] && savedStepData[4]?.ids) {
          const savedIds = savedStepData[4].ids as number[];
          const educationDetailsWithIds = requestDataEducationDetails.map(
            (detail, index) => ({
              ...detail,
              id: savedIds[index]
            })
          );

          response = await saveEmployeeEducationDetailRequest({
            educationalDetails: educationDetailsWithIds
          });
        } else {
          response = await saveEmployeeEducationDetailRequest({
            educationalDetails: requestDataEducationDetails
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 4: true }));
          setSavedStepData((prev) => ({
            ...prev,
            4: { data: requestDataEducationDetails, ids: response.ids }
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[4]
              ? toastMessages.success.adminDashboard.employee
                  .employeeEducationDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeEducationDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 5) {
        const requestDataEmergencyContacts = values.emergencyContactDetails.map(
          (contact) => ({
            contactName: contact.txtContactName,
            contactAddress: contact.txtContactAddress,
            contactRelation: contact.ddlContactRelation,
            phone: contact.txtPhone,
            userId
          })
        );

        if (completedSteps[5] && savedStepData[5]?.ids) {
          const savedIds = savedStepData[5].ids as number[];
          const emergencyContactsWithIds = requestDataEmergencyContacts.map(
            (contact, index) => ({
              ...contact,
              id: savedIds[index]
            })
          );

          response = await saveEmployeeEmergencyContactDetailRequest({
            emergencyContacts: emergencyContactsWithIds
          });
        } else {
          response = await saveEmployeeEmergencyContactDetailRequest({
            emergencyContacts: requestDataEmergencyContacts
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 5: true }));
          setSavedStepData((prev) => ({
            ...prev,
            5: { data: requestDataEmergencyContacts, ids: response.ids }
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[5]
              ? toastMessages.success.adminDashboard.employee
                  .employeeEmergencyContactsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeEmergencyContactsSaved,
            'success'
          );
        }
      } else if (activeStep === 6) {
        const requestDataExperienceDetails = values.experienceDetails.map(
          (detail) => ({
            companyName: detail.txtCompanyName,
            employeeId: detail.txtEmployeeId,
            jobTitle: detail.txtJobTitle,
            startDate: detail.txtStartDate,
            endDate: detail.txtEndDate,
            country: detail.ddlCountry,
            city: detail.txtCity,
            state: detail.ddlState,
            employmentType: detail.ddlEmploymentType,
            supervisorName: detail.txtSupervisorName,
            supervisorPhone: detail.txtSupervisorPhone,
            userId
          })
        );

        if (completedSteps[6] && savedStepData[6]?.ids) {
          const savedIds = savedStepData[6].ids as number[];
          const experienceDetailsWithIds = requestDataExperienceDetails.map(
            (detail, index) => ({
              ...detail,
              id: savedIds[index]
            })
          );

          response = await SaveEmployeeExperienceDetails({
            experienceDetails: experienceDetailsWithIds
          });
        } else {
          response = await SaveEmployeeExperienceDetails({
            experienceDetails: requestDataExperienceDetails
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 6: true }));
          setSavedStepData((prev) => ({
            ...prev,
            6: { data: requestDataExperienceDetails, ids: response.ids }
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[6]
              ? toastMessages.success.adminDashboard.employee
                  .employeeExperienceDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeExperienceDetailsSaved,
            'success'
          );
        }
      } else if (activeStep === 2) {
        const requestDataAddressDetails = values.addressDetails.map(
          (detail) => ({
            addressType: detail.ddlAddressType,
            buildingName: detail.txtBuildingName,
            flatNumber: detail.txtFlatNumber,
            streetName: detail.txtStreetName,
            landmark: detail.txtLandmark,
            city: detail.txtCity,
            state: detail.ddlState,
            country: detail.ddlCountry,
            pincode: detail.txtPincode,
            phone: detail.txtPhone,
            userId
          })
        );

        if (completedSteps[2] && savedStepData[2]?.ids) {
          const savedIds = savedStepData[2].ids as number[];
          const addressDetailsWithIds = requestDataAddressDetails.map(
            (detail, index) => ({
              ...detail,
              id: savedIds[index]
            })
          );

          response = await saveEmployeeAddressDetailRequest({
            employeeAddresses: addressDetailsWithIds
          });
        } else {
          console.log('requestDataAddressDetails', requestDataAddressDetails);

          response = await saveEmployeeAddressDetailRequest({
            employeeAddresses: requestDataAddressDetails
          });
        }

        if (response?.status.response_code === 200) {
          setCompletedSteps((prev) => ({ ...prev, 2: true }));
          setSavedStepData((prev) => ({
            ...prev,
            2: { data: requestDataAddressDetails, ids: response.ids }
          }));
          setActiveStep(activeStep + 1);
          setSubmitting(false);
          showSnackbar(
            completedSteps[2]
              ? toastMessages.success.adminDashboard.employee
                  .employeeAddressDetailsUpdated
              : toastMessages.success.adminDashboard.employee
                  .employeeAddressDetailsSaved,
            'success'
          );
        }
      }
    } catch (error) {
      showSnackbar(toastMessages.error.common, 'error');
      setSubmitting(false);
    }
  };

  const validationSchema = [
    // Create User Validation (Single)
    Yup.object().shape({
      txtFirstName: Yup.string()
        .trim()
        .required('Please enter the first name.')
        .matches(/^[a-zA-Z]*$/, 'Please enter only alphabets.'),
      txtLastName: Yup.string()
        .trim()
        .required('Please enter the last name.')
        .matches(/^[a-zA-Z]*$/, 'Please enter only alphabets.'),
      txtEmail: Yup.string()
        .trim()
        .email('Please enter the valid email address.')
        .required('Please enter the email address.')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Please enter valid email'
        ),
      txtPassword: Yup.string()
        .min(7, 'Password should be minimum 7 characters.')
        .max(100, 'Password should be maximum 100 characters.')
        .required('Please enter the password.'),
      ddlRoles: Yup.array()
        .min(1, 'Please select the role.')
        .required('Please select the role.'),
      txtEmployeeCode: Yup.string()
        .required('Please enter the employee code.')
        .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols not allowed'),
      ddlDesignation: isEmployeeSubModulePresent
        ? Yup.string()
            .min(1, 'Please select the designation.')
            .required('Please select the designation.')
        : Yup.string(),
      ddlReportingUser: Yup.string().required(
        'Please select the reporting user.'
      ),
      txtJoinDate: Yup.date()
        .required('Please enter the join date.')
        .max(new Date(), 'Joining date cannot be in the future.'),
      ddlEmploymentType: Yup.string().required(
        'Please select the employment type.'
      ),
      ddlWorkingType: Yup.string().required('Please select the work mode.'),
      chkIsActive: Yup.boolean(),
      chkShowActivity: Yup.boolean()
    }),

    // Professional Details Validation (Single)
    // Yup.object().shape({
    //   txtEmployeeCode: Yup.string()
    //     .required('Please enter the employee code.')
    //     .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols not allowed'),
    //   ddlDesignation: isEmployeeSubModulePresent
    //     ? Yup.string()
    //         .min(1, 'Please select the designation.')
    //         .required('Please select the designation.')
    //     : Yup.string(),
    //   ddlReportingUser: Yup.string().required(
    //     'Please select the reporting user.'
    //   ),
    //   txtJoinDate: Yup.date()
    //     .required('Please enter the join date.')
    //     .max(new Date(), 'Joining date cannot be in the future.'),
    //   ddlEmploymentType: Yup.string().required(
    //     'Please select the employment type.'
    //   ),
    //   ddlWorkingType: Yup.string().required('Please select the work mode.')
    // }),

    // Personal Details Validation (Single)
    Yup.object().shape({
      txtBirthDate: Yup.date()
        .required('Please enter the birth date.')
        .max(new Date(), 'Birth date cannot be in the future.'),
      // txtAge: Yup.number().nullable(),
      ddlBirthCountry: Yup.string().required(
        'Please select the birth country.'
      ),
      ddlBirthState: Yup.string().required('Please select the birth state.'),
      txtBirthLocation: Yup.string().required(
        'Please enter the birth location.'
      ),
      // .matches(
      //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
      //   'Only letters, spaces, and special characters are allowed'
      // ),
      ddlGender: Yup.string().required('Please select the gender.'),
      ddlMaritalStatus: Yup.string().required(
        'Please select the marital status.'
      ),
      txtMarriageDate: Yup.date().when(['ddlMaritalStatus'], {
        is: (status: any) =>
          ['married', 'widowed', 'divorced'].includes(status),
        then: (schema) => schema.required('Please enter the marriage date.'),
        otherwise: (schema) => schema.nullable()
      }),
      ddlBloodGroup: Yup.string().required('Please select the blood group.'),
      txtPanNumber: Yup.string()
        .transform((value) => value.toUpperCase())
        .matches(
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          'Please enter a valid PAN number.'
        )
        .required('Please enter the PAN number.'),
      txtCaste: Yup.string().matches(
        /^[a-zA-Z]*$/,
        'Please enter only alphabets.'
      ),
      txtReligion: Yup.string().matches(
        /^[a-zA-Z]*$/,
        'Please enter only alphabets.'
      ),
      txtResidence: Yup.string().matches(
        /^[a-zA-Z0-9 ]+$/,
        'Special Symbols not allowed'
      )
    }),

    // Address Details Validation (Multiple)
    Yup.object().shape({
      addressDetails: Yup.array()
        .of(
          Yup.object().shape({
            // ddlAddressType: Yup.string().required(
            //   'Please select the address type.'
            // ),
            txtBuildingName: Yup.string()
              // .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols not allowed')
              .required('Please enter the Building Name'),
            txtFlatNumber: Yup.string()
              // .matches(/^[0-9]/, 'Please Enter only numeric values')
              .required('Please enter the Flat Number'),
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
    }),

    // Family Details Validation (Multiple)
    Yup.object().shape({
      familyDetails: Yup.array()
        .of(
          Yup.object().shape({
            ddlRelationType: Yup.string().required(
              'Please select the relation type.'
            ),
            txtName: Yup.string()
              .required('Please enter the name.')
              .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabets'),
            // ddlBirthCountry: Yup.string().required(
            //   'Please select the birth country.'
            // ),
            // ddlBirthState: Yup.string().required(
            //   'Please select the birth state.'
            // ),
            // txtBirthLocation: Yup.string().required(
            //   'Please enter the birth location.'
            // ),
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
    }),

    // Education Details Validation (Multiple)
    Yup.object().shape({
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
            ddlStudyMode: Yup.string().required(
              'Please select the study mode.'
            ),
            txtPercentage: Yup.number()
              .min(0, 'Score cannot be negative.')
              .max(100, 'Score cannot be more than 100.')
              .required('Please enter the GPA/Score.')
              .typeError('Must be a number (e.g., 85.5)')
          })
        )
        .min(1, 'Please add at least one education record.')
    }),

    // Emergency Contact Details Validation (Multiple)
    Yup.object().shape({
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
    }),

    // Experience Details Validation (Multiple)
    Yup.object().shape({
      experienceDetails: Yup.array()
        .of(
          Yup.object().shape({
            txtCompanyName: Yup.string()
              // .matches(
              //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
              //   'Only letters, spaces, and special characters are allowed'
              // )
              .required('Please enter the start date.'),
            txtEmployeeId: Yup.string().matches(
              /^[a-zA-Z0-9 ]+$/,
              'Special Symbols Not Allowed.'
            ),
            txtJobTitle: Yup.string().required('Please enter the job title.'),
            // .matches(
            //   /^[a-zA-Z\s\-_.(),&@#!]+$/,
            //   'Only letters, spaces, and special characters are allowed'
            // ),
            txtStartDate: Yup.date()
              .required('Please enter the start date.')
              .max(new Date(), 'Start date cannot be in the future.'),
            txtEndDate: Yup.date()
              .min(
                Yup.ref('txtStartDate'),
                'End date must be after start date.'
              )
              .required('Please enter the end date.'),
            ddlCountry: Yup.string().required('Please select the country.'),
            txtCity: Yup.string().required('Please enter the city.'),
            ddlState: Yup.string().required('Please select the state.'),
            ddlEmploymentType: Yup.string().required(
              'Please select the employment type.'
            ),
            txtSupervisorName: Yup.string()
              // .required('Please enter the supervisor name.')
              .matches(/^[a-zA-Z ]+$/, 'Please enter only alphabets'),
            txtSupervisorPhone: Yup.string().matches(
              /^[0-9]{10}$/,
              'Please enter a valid 10-digit phone number.'
            )
            // .required('Please enter the supervisor phone number.')
          })
        )
        .min(1, 'Please add at least one experience record.')
    }),

    Yup.object().shape({
      documentDetails: Yup.array().of(
        Yup.object().shape({
          documentTypeId: Yup.number().required('Document type is required'),
          employeeDocument: Yup.mixed()
            .required('Document is required')
            .test('fileSize', 'File size must be less than 1MB', (value) => {
              if (!value) return true; // Skip validation if no file is provided
              const file = value as File; // Explicitly cast to File
              return file.size <= 1000000;
            })
            .test(
              'fileType',
              'File type must be PDF, JPEG, JPG, or PNG',
              (value) => {
                if (!value) return true; // Skip validation if no file is provided
                const file = value as File; // Explicitly cast to File
                return ALLOWED_FILE_FORMATS.includes(file.type);
              }
            )
        })
      )
    })
  ];
  const currentValidationSchema = validationSchema[activeStep];

  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${theme.breakpoints.up('md')}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },

    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },

    // Only show active/completed styles when explicitly set
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.grey[400] // Use a neutral color for active
      }
    },

    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.grey[400] // Use a neutral color for non-completed
      }
    },

    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.grey[400],
      borderTopWidth: 2,
      borderRadius: 4
    }
  }));

  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    flexDirection: 'column',
    '& .MuiStepLabel-iconContainer': {
      paddingRight: 0,
      marginBottom: 4
    },
    '& .MuiStepLabel-label': {
      marginTop: 4,
      fontSize: '0.75rem',
      textAlign: 'center',
      maxWidth: '70px',
      wordWrap: 'break-word',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        maxWidth: '60px'
      },
      '&.Mui-active': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        transform: 'scale(1.05)',
        transition: 'all 0.3s ease'
      }
    }
  }));

  useEffect(() => {
    handleGetRoles();
    handleGetDesignations();
    handleGetEmployees();
    // handleGetDocumentTypes();
  }, []);

  useEffect(() => {
    handleGetDesignations();
  }, [open]);

  useEffect(() => {
    handleGetDocumentTypes();
  }, [openDocument]);

  return (
    <Box sx={{ width: '100%' }}>
      <>
        <AdminDashboardPage title="Manage Employees">
          {!loading ? (
            <AdminFormLayout
              title="Add Employee"
              subtitle="Please fill the below details to create new employee."
            >
              <>
                <Formik
                  enableReinitialize={false}
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
                  }) => {
                    const handleEmployeeSubmit = (): void => {
                      const allDocumentsUploaded = documentTypes.every(
                        (docType) =>
                          values.documentDetails.some(
                            (doc) =>
                              doc.documentTypeId === docType.id &&
                              doc.employeeDocument
                          )
                      );
                      console.log('document types are', documentTypes);
                      console.log(
                        'allDocumentsUploaded is',
                        allDocumentsUploaded
                      );

                      if (!allDocumentsUploaded) {
                        showSnackbar(
                          'Please upload & save all required documents before submitting.',
                          'error'
                        );
                        return;
                      }

                      showSnackbar(
                        toastMessages.success.adminDashboard.employee
                          .employeeOnboard,
                        'success'
                      );
                      navigate(manageEmployeePath);
                    };
                    // const handleSaveAndExit = async (): Promise<void> => {
                    //   try {
                    //     // Validate required fields
                    //     if (
                    //       // !values.txtFirstName ||
                    //       // !values.txtLastName ||
                    //       // !values.txtEmail ||
                    //       // !values.txtPassword ||
                    //       // !values.ddlRoles.length ||
                    //       !values.txtEmployeeCode ||
                    //       !values.ddlReportingUser ||
                    //       !values.txtJoinDate ||
                    //       !values.ddlEmploymentType ||
                    //       !values.ddlWorkingType
                    //     ) {
                    //       showSnackbar(
                    //         'Please fill all required fields',
                    //         'error'
                    //       );
                    //       return;
                    //     }

                    //     setLoading(true);

                    //     // const requestDataUserForm: any = {
                    //     //   firstName: values.txtFirstName,
                    //     //   lastName: values.txtLastName,
                    //     //   email: values.txtEmail,
                    //     //   password: values.txtPassword,
                    //     //   phone: values.txtPhone,
                    //     //   roleIds: JSON.stringify(values.ddlRoles),
                    //     //   isActive: values.chkIsActive,
                    //     //   showActivity: values.chkShowActivity
                    //     // };
                    //     const requestDataProfessionalDetailsForm: any = {
                    //       employeeCode: values.txtEmployeeCode,
                    //       reportingUserId: values.ddlReportingUser,
                    //       joiningDate: values.txtJoinDate,
                    //       employmentType: values.ddlEmploymentType,
                    //       workingType: values.ddlWorkingType,
                    //       userId
                    //     };
                    //     if (isEmployeeSubModulePresent) {
                    //       requestDataProfessionalDetailsForm.designationId =
                    //         values.ddlDesignation;
                    //     }

                    //     const response =
                    //       await insertEmployeeProfessionalDetailRequest(
                    //         requestDataProfessionalDetailsForm
                    //       );

                    //     if (response?.id) {
                    //       setCompletedSteps((prev) => ({ ...prev, 1: true }));
                    //       setSavedStepData((prev) => ({
                    //         ...prev,
                    //         1: {
                    //           data: requestDataProfessionalDetailsForm,
                    //           ids: response.id
                    //         }
                    //       }));

                    //       showSnackbar(
                    //         toastMessages.success.adminDashboard.employee
                    //           .employeeOnboard,
                    //         'success'
                    //       );
                    //       navigate(manageEmployeePath);
                    //     } else {
                    //       showSnackbar(toastMessages.error.common, 'error');
                    //     }
                    //   } catch (error) {
                    //     showSnackbar(
                    //       'Failed to save and exit. Please try again.',
                    //       'error'
                    //     );
                    //   } finally {
                    //     setLoading(false);
                    //   }
                    // };
                    // const companySubModules = ['manage_employees'];
                    return (
                      <>
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                          {isEmployeeSubModulePresent ? (
                            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                              <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                connector={<CustomConnector />}
                                sx={{
                                  mt: 2,
                                  p: 1,
                                  '& .MuiStep-root': {
                                    padding: '0 8px',
                                    cursor: 'pointer'
                                  }
                                }}
                              >
                                {stepsWithEmployeeManagementSubModulePresent.map(
                                  (label, index) => (
                                    <Step
                                      key={label}
                                      completed={completedSteps[index] === true}
                                      onClick={() => handleStepClick(index)}
                                      sx={{
                                        '&:hover': {
                                          '& .MuiStepLabel-label': {
                                            color: (theme) =>
                                              theme.palette.primary.main
                                          }
                                        }
                                      }}
                                    >
                                      <CustomStepLabel
                                        sx={{
                                          cursor: 'pointer',
                                          '& .MuiStepIcon-root': {
                                            ...(completedSteps[index] && {
                                              '&.Mui-completed': {
                                                color: (theme) =>
                                                  theme.palette.primary.main
                                              }
                                            })
                                          }
                                        }}
                                      >
                                        {label}
                                      </CustomStepLabel>
                                    </Step>
                                  )
                                )}
                              </Stepper>
                            </Box>
                          ) : (
                            <Stepper
                              activeStep={activeStep}
                              sx={{ mt: 2, p: 2 }}
                            >
                              {stepsWithoutEmployeeManagementSubModulePresent.map(
                                (label) => {
                                  const stepProps: { completed?: boolean } = {};
                                  const labelProps: {
                                    optional?: React.ReactNode;
                                  } = {};

                                  return (
                                    <Step key={label} {...stepProps}>
                                      <StepLabel {...labelProps}>
                                        {label}
                                      </StepLabel>
                                    </Step>
                                  );
                                }
                              )}
                            </Stepper>
                          )}
                          {activeStep === 0 && (
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
                                      touched.txtFirstName &&
                                        errors.txtFirstName
                                    )}
                                    helperText={String(
                                      touched.txtFirstName &&
                                        errors.txtFirstName
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
                                    label="Email"
                                    name="txtEmail"
                                    type="email"
                                    value={values.txtEmail}
                                    inputProps={{ maxLength: 100 }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtEmail && errors.txtEmail
                                    )}
                                    helperText={String(
                                      touched.txtEmail && errors.txtEmail
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
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={Boolean(
                                      touched.txtPassword && errors.txtPassword
                                    )}
                                    helperText={String(
                                      touched.txtPassword && errors.txtPassword
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <AutoCompleteInput
                                    multiple
                                    label="Select Role"
                                    name="ddlRoles"
                                    value={values.ddlRoles}
                                    data={
                                      roles?.map(
                                        (val: ShortRoleModel) => val.id
                                      ) || []
                                    }
                                    originalData={roles}
                                    itemId="id"
                                    itemName="name"
                                    placeholder="search role"
                                    limitTags={2}
                                    renderOption={(
                                      props: any,
                                      option: any,
                                      { selected }: any
                                    ) => (
                                      <MenuItem {...props}>
                                        <Checkbox checked={selected} />
                                        {roles?.find(
                                          (val: ShortRoleModel) =>
                                            val.id === option
                                        )?.name || ''}
                                      </MenuItem>
                                    )}
                                    onChange={(e: any) => {
                                      setFieldValue('ddlRoles', e);
                                    }}
                                    error={Boolean(
                                      touched.ddlRoles && errors.ddlRoles
                                    )}
                                    helperText={String(
                                      touched.ddlRoles && errors.ddlRoles
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Employee Code"
                                    name="txtEmployeeCode"
                                    value={values.txtEmployeeCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                    helperText={String(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                  />
                                </Grid>
                                {isEmployeeSubModulePresent && (
                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Select Designation"
                                      name="ddlDesignation"
                                      value={values.ddlDesignation}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        touched.ddlDesignation &&
                                          errors.ddlDesignation
                                      )}
                                      helperText={String(
                                        touched.ddlDesignation &&
                                          errors.ddlDesignation
                                      )}
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {designations.map((option: any) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.id}
                                        >
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                    </SelectInput>
                                    <Button onClick={() => setOpen(true)}>
                                      Add Designation
                                    </Button>
                                    <PopupAddDesignation
                                      open={open}
                                      onClose={() => setOpen(false)}
                                    />
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Reporting Manager"
                                    name="ddlReportingUser"
                                    value={values.ddlReportingUser}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlReportingUser &&
                                        errors.ddlReportingUser
                                    )}
                                    helperText={String(
                                      touched.ddlReportingUser &&
                                        errors.ddlReportingUser
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {users.map((option: any) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {`${option.first_name} ${option.last_name}`}
                                      </MenuItem>
                                    ))}
                                  </SelectInput>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtJoinDate}
                                      onChange={(newValue: any) => {
                                        setFieldValue('txtJoinDate', newValue);
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtJoinDate"
                                          label="Joining Date"
                                          error={Boolean(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                          helperText={String(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtJoinDate"
                                            value={values.txtJoinDate}
                                            error={Boolean(
                                              touched.txtJoinDate &&
                                                errors.txtJoinDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Employment Type"
                                    name="ddlEmploymentType"
                                    value={values.ddlEmploymentType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                    helperText={String(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.employmentType.map(
                                      (option: any) => (
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
                                    label="Work Mode"
                                    name="ddlWorkingType"
                                    value={values.ddlWorkingType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                    helperText={String(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.workingType.map(
                                      (option: any) => (
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
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={6}
                                  sx={{ paddingTop: '52px !important' }}
                                >
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
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        name="chkShowActivity"
                                        checked={values.chkShowActivity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    }
                                    label={
                                      <Typography variant="body2" ml={2}>
                                        Show Activity
                                      </Typography>
                                    }
                                    sx={adminStyle.formControlLabel}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          )}
                          {/* {activeStep === 1 && (
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6}>
                                  <TextInput
                                    fullWidth
                                    label="Employee Code"
                                    name="txtEmployeeCode"
                                    value={values.txtEmployeeCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                    helperText={String(
                                      touched.txtEmployeeCode &&
                                        errors.txtEmployeeCode
                                    )}
                                  />
                                </Grid>
                                {isEmployeeSubModulePresent && (
                                  <Grid item xs={12} sm={6} md={6}>
                                    <SelectInput
                                      label="Select Designation"
                                      name="ddlDesignation"
                                      value={values.ddlDesignation}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={Boolean(
                                        touched.ddlDesignation &&
                                          errors.ddlDesignation
                                      )}
                                      helperText={String(
                                        touched.ddlDesignation &&
                                          errors.ddlDesignation
                                      )}
                                    >
                                      <MenuItem key="-1" value="">
                                        - None -
                                      </MenuItem>
                                      {designations.map((option: any) => (
                                        <MenuItem
                                          key={option.id}
                                          value={option.id}
                                        >
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                    </SelectInput>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Reporting Manager"
                                    name="ddlReportingUser"
                                    value={values.ddlReportingUser}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlReportingUser &&
                                        errors.ddlReportingUser
                                    )}
                                    helperText={String(
                                      touched.ddlReportingUser &&
                                        errors.ddlReportingUser
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {users.map((option: any) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {`${option.first_name} ${option.last_name}`}
                                      </MenuItem>
                                    ))}
                                  </SelectInput>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtJoinDate}
                                      onChange={(newValue: any) => {
                                        setFieldValue('txtJoinDate', newValue);
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtJoinDate"
                                          label="Joining Date"
                                          error={Boolean(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                          helperText={String(
                                            touched.txtJoinDate &&
                                              errors.txtJoinDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtJoinDate"
                                            value={values.txtJoinDate}
                                            error={Boolean(
                                              touched.txtJoinDate &&
                                                errors.txtJoinDate
                                            )}
                                          />
                                        </CustomField>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Employment Type"
                                    name="ddlEmploymentType"
                                    value={values.ddlEmploymentType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                    helperText={String(
                                      touched.ddlEmploymentType &&
                                        errors.ddlEmploymentType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.employmentType.map(
                                      (option: any) => (
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
                                    label="Work Mode"
                                    name="ddlWorkingType"
                                    value={values.ddlWorkingType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                    helperText={String(
                                      touched.ddlWorkingType &&
                                        errors.ddlWorkingType
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeeProfessionalDetails.workingType.map(
                                      (option: any) => (
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
                            </CardContent>
                          )} */}
                          {activeStep === 1 && (
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtBirthDate}
                                      onChange={(newValue: any) => {
                                        const birthDate = getDate(
                                          newValue,
                                          'dd MMM yyyy'
                                        );
                                        setFieldValue(
                                          'txtBirthDate',
                                          birthDate
                                        );
                                        // // Calculate and set age automatically
                                        // const age = calculateAge(birthDate);
                                        // setFieldValue('txtAge', age);
                                      }}
                                      renderInput={(params: any) => (
                                        <CustomField
                                          name="txtBirthDate"
                                          label="Birth Date"
                                          error={Boolean(
                                            touched.txtBirthDate &&
                                              errors.txtBirthDate
                                          )}
                                          helperText={String(
                                            touched.txtBirthDate &&
                                              errors.txtBirthDate
                                          )}
                                        >
                                          <TextField
                                            {...params}
                                            fullWidth
                                            size="medium"
                                            name="txtBirthDate"
                                            value={values.txtBirthDate}
                                            error={Boolean(
                                              touched.txtBirthDate &&
                                                errors.txtBirthDate
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
                                    disabled
                                    value={values.txtAge}
                                    inputProps={{ readOnly: true }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtAge && errors.txtAge
                                    )}
                                    helperText={String(
                                      touched.txtAge && errors.txtAge
                                    )}
                                  />
                                </Grid> */}
                                <Grid item xs={12} sm={6} md={6}>
                                  <SelectInput
                                    label="Select Birth Country"
                                    name="ddlBirthCountry"
                                    value={values.ddlBirthCountry}
                                    onChange={(e) => {
                                      handleChange(e);
                                      handleCountryChange(
                                        e.target.value as string
                                      );
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlBirthCountry &&
                                        errors.ddlBirthCountry
                                    )}
                                    helperText={String(
                                      touched.ddlBirthCountry &&
                                        errors.ddlBirthCountry
                                    )}
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
                                    label="Select Birth State"
                                    name="ddlBirthState"
                                    value={values.ddlBirthState}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlBirthState &&
                                        errors.ddlBirthState
                                    )}
                                    helperText={String(
                                      touched.ddlBirthState &&
                                        errors.ddlBirthState
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
                                      touched.txtBirthLocation &&
                                        errors.txtBirthLocation
                                    )}
                                    helperText={String(
                                      touched.txtBirthLocation &&
                                        errors.txtBirthLocation
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
                                    error={Boolean(
                                      touched.ddlGender && errors.ddlGender
                                    )}
                                    helperText={String(
                                      touched.ddlGender && errors.ddlGender
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.gender.map(
                                      (option: any) => (
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
                                    label="Select Marital Status"
                                    name="ddlMaritalStatus"
                                    value={values.ddlMaritalStatus}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.ddlMaritalStatus &&
                                        errors.ddlMaritalStatus
                                    )}
                                    helperText={String(
                                      touched.ddlMaritalStatus &&
                                        errors.ddlMaritalStatus
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.maritalStatus.map(
                                      (option: any) => (
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      openTo="day"
                                      inputFormat="DD/MM/YYYY"
                                      value={values.txtMarriageDate}
                                      disabled={
                                        values.ddlMaritalStatus === 'single'
                                      }
                                      onChange={(newValue: any) => {
                                        setFieldValue(
                                          'txtMarriageDate',
                                          newValue
                                        );
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
                                      touched.ddlBloodGroup &&
                                        errors.ddlBloodGroup
                                    )}
                                    helperText={String(
                                      touched.ddlBloodGroup &&
                                        errors.ddlBloodGroup
                                    )}
                                  >
                                    <MenuItem key="-1" value="">
                                      - None -
                                    </MenuItem>
                                    {employeePersonalDetails.bloodGroups.map(
                                      (option: any) => (
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
                                    label="Pan Number"
                                    name="txtPanNumber"
                                    value={values.txtPanNumber.toUpperCase()}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                      touched.txtPanNumber &&
                                        errors.txtPanNumber
                                    )}
                                    helperText={String(
                                      touched.txtPanNumber &&
                                        errors.txtPanNumber
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
                                    error={Boolean(
                                      touched.txtCaste && errors.txtCaste
                                    )}
                                    helperText={String(
                                      touched.txtCaste && errors.txtCaste
                                    )}
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
                                      touched.txtResidence &&
                                        errors.txtResidence
                                    )}
                                    helperText={String(
                                      touched.txtResidence &&
                                        errors.txtResidence
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          )}
                          {activeStep === 2 && (
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
                                    >
                                      <Typography variant="subtitle1">
                                        Present Address
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Grid container spacing={2}>
                                        {/* <Grid item xs={12} sm={6} md={6}>
                                          <TextInput
                                            label="Address Type"
                                            name={`addressDetails.${0}.ddlAddressType`}
                                            value={
                                              values.addressDetails[0]
                                                .ddlAddressType ||
                                              'Present Address'
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
                                          />
                                        </Grid> */}

                                        <Grid item xs={12} sm={6} md={6}>
                                          <TextInput
                                            fullWidth
                                            label="Building Name"
                                            name={`addressDetails.${0}.txtBuildingName`}
                                            value={
                                              values.addressDetails[0]
                                                .txtBuildingName
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
                                              values.addressDetails[0]
                                                .txtFlatNumber
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
                                              values.addressDetails[0]
                                                .txtStreetName
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
                                            value={
                                              values.addressDetails[0]
                                                .txtLandmark
                                            }
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
                                            value={
                                              values.addressDetails[0].txtCity
                                            }
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
                                            value={
                                              values.addressDetails[0]
                                                .ddlCountry
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
                                            value={
                                              values.addressDetails[0].ddlState
                                            }
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
                                            value={
                                              values.addressDetails[0]
                                                .txtPincode
                                            }
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
                                            value={
                                              values.addressDetails[0].txtPhone
                                            }
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
                                          setSameAsPresentAddress(
                                            e.target.checked
                                          );
                                          if (e.target.checked) {
                                            const presentAddress =
                                              values.addressDetails[0];
                                            setFieldValue('addressDetails.1', {
                                              ...presentAddress,
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
                                      >
                                        <Typography variant="subtitle1">
                                          Permanent Address
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Grid container spacing={2}>
                                          {/* <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              label="Address Type"
                                              name={`addressDetails.${1}.ddlAddressType`}
                                              value={
                                                values.addressDetails[1]
                                                  .ddlAddressType ||
                                                'Permanent Address'
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
                                            />
                                          </Grid> */}

                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Building Name"
                                              name={`addressDetails.${1}.txtBuildingName`}
                                              value={
                                                values.addressDetails[1]
                                                  .txtBuildingName
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
                                                values.addressDetails[1]
                                                  .txtFlatNumber
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
                                                values.addressDetails[1]
                                                  .txtStreetName
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
                                                values.addressDetails[1]
                                                  .txtLandmark
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
                                              value={
                                                values.addressDetails[1].txtCity
                                              }
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
                                                values.addressDetails[1]
                                                  .ddlCountry
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
                                              value={
                                                values.addressDetails[1]
                                                  .ddlState
                                              }
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
                                                <MenuItem
                                                  key={i}
                                                  value={option}
                                                >
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
                                                values.addressDetails[1]
                                                  .txtPincode
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
                                              value={
                                                values.addressDetails[1]
                                                  .txtPhone
                                              }
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
                          )}
                          {activeStep === 3 && (
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
                                  <Box>
                                    <Grid
                                      container
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        marginTop: '10px'
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          push(
                                            initialValuesFamilyDetailsEntries
                                          )
                                        }
                                      >
                                        Add Member
                                      </Button>
                                    </Grid>
                                  </Box>

                                  {values.familyDetails.map((member, index) => (
                                    <Accordion
                                      key={index}
                                      sx={{ mb: 2 }}
                                      defaultExpanded
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`family-member-${index}-content`}
                                        id={`family-member-${index}-header`}
                                      >
                                        <Grid
                                          container
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <Grid item xs={11}>
                                            <Typography variant="subtitle1">
                                              Family Member #{index + 1}
                                              {member.txtName &&
                                                ` - ${member.txtName}`}
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
                                              value={
                                                values.familyDetails[index]
                                                  .txtName
                                              }
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
                                          {/* <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Age"
                                              name={`familyDetails.${index}.txtAge`}
                                              type="number"
                                              value={
                                                values.familyDetails[index]
                                                  .txtAge
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              inputProps={{ readOnly: true }}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtAge`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtAge`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtAge`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtAge`
                                                )
                                              }
                                            />
                                          </Grid> */}
                                          {/* <Grid item xs={12} sm={6} md={6}>
                                            <SelectInput
                                              label="Birth Country"
                                              name={`familyDetails.${index}.ddlBirthCountry`}
                                              value={
                                                values.familyDetails[index]
                                                  .ddlBirthCountry
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
                                                  `familyDetails.${index}.ddlBirthCountry`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.ddlBirthCountry`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthCountry`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.ddlBirthCountry`
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
                                          </Grid> */}
                                          {/* <Grid item xs={12} sm={6} md={6}>
                                            <SelectInput
                                              label="Birth State"
                                              name={`familyDetails.${index}.ddlBirthState`}
                                              value={
                                                values.familyDetails[index]
                                                  .ddlBirthState
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthState`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.ddlBirthState`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.ddlBirthState`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.ddlBirthState`
                                                )
                                              }
                                            >
                                              <MenuItem key="-1" value="">
                                                - None -
                                              </MenuItem>
                                              {states.map((option, i) => (
                                                <MenuItem
                                                  key={i}
                                                  value={option}
                                                >
                                                  {option}
                                                </MenuItem>
                                              ))}
                                            </SelectInput>
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Birth Location"
                                              name={`familyDetails.${index}.txtBirthLocation`}
                                              value={
                                                values.familyDetails[index]
                                                  .txtBirthLocation
                                              }
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `familyDetails.${index}.txtBirthLocation`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `familyDetails.${index}.txtBirthLocation`
                                                )
                                              }
                                            />
                                          </Grid> */}
                                          <Grid item xs={12} sm={6} md={6}>
                                            <TextInput
                                              fullWidth
                                              label="Occupation"
                                              name={`familyDetails.${index}.txtOccupation`}
                                              value={
                                                values.familyDetails[index]
                                                  .txtOccupation
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
                                              value={
                                                values.familyDetails[index]
                                                  .txtPhone
                                              }
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
                          )}
                          {activeStep === 4 && (
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
                                  <Box>
                                    <Grid
                                      container
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        marginTop: '10px'
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          push(
                                            initialValuesEducationDetailsEntries
                                          )
                                        }
                                        sx={{ ml: 80, mb: 2 }}
                                      >
                                        Add Education
                                      </Button>
                                    </Grid>
                                  </Box>

                                  {values.educationDetails.map(
                                    (education, index) => (
                                      <Accordion
                                        key={index}
                                        sx={{ mb: 2 }}
                                        defaultExpanded
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`education-${index}-content`}
                                          id={`education-${index}-header`}
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
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
                                                  values.educationDetails[index]
                                                    .ddlCourse
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
                                                  value={
                                                    values.educationDetails[
                                                      index
                                                    ].txtFromDate
                                                      ? dayjs(
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtFromDate
                                                        )
                                                      : null
                                                  }
                                                  onChange={(
                                                    newValue: dayjs.Dayjs | null
                                                  ) => {
                                                    // Set to first day of the month when month/year is selected
                                                    const dateWithFirstDay =
                                                      newValue
                                                        ? newValue.startOf(
                                                            'month'
                                                          )
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
                                                      label="Start Date"
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
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtFromDate
                                                            ? dayjs(
                                                                values
                                                                  .educationDetails[
                                                                  index
                                                                ].txtFromDate
                                                              ).format(
                                                                'MM/YYYY'
                                                              )
                                                            : ''
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
                                                    values.educationDetails[
                                                      index
                                                    ].txtToDate
                                                      ? dayjs(
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtToDate
                                                        )
                                                      : null
                                                  }
                                                  onChange={(
                                                    newValue: dayjs.Dayjs | null
                                                  ) => {
                                                    // Set to first day of the month when month/year is selected
                                                    const dateWithFirstDay =
                                                      newValue
                                                        ? newValue.startOf(
                                                            'month'
                                                          )
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
                                                      label="End Date"
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
                                                          values
                                                            .educationDetails[
                                                            index
                                                          ].txtToDate
                                                            ? dayjs(
                                                                values
                                                                  .educationDetails[
                                                                  index
                                                                ].txtToDate
                                                              ).format(
                                                                'MM/YYYY'
                                                              )
                                                            : ''
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
                                                  values.educationDetails[index]
                                                    .ddlStatus
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
                                    )
                                  )}
                                </div>
                              )}
                            </FieldArray>
                          )}
                          {activeStep === 5 && (
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
                                  <Box>
                                    <Grid
                                      container
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        marginTop: '10px'
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          push(
                                            initialValuesEmergencyContactDetailsEntries
                                          )
                                        }
                                        sx={{ ml: 80, mb: 2 }}
                                      >
                                        Add Contact
                                      </Button>
                                    </Grid>
                                  </Box>

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
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
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
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtContactName
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
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtContactAddress
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
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].ddlContactRelation
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
                                                  values
                                                    .emergencyContactDetails[
                                                    index
                                                  ].txtPhone
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
                          )}
                          {activeStep === 6 && (
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
                                  <Box>
                                    <Grid
                                      container
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        marginTop: '10px'
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          push(
                                            initialValuesExperienceDetailsEntries
                                          )
                                        }
                                        sx={{ ml: 80, mb: 2 }}
                                      >
                                        Add Experience
                                      </Button>
                                    </Grid>
                                  </Box>

                                  {values.experienceDetails.map(
                                    (experience, index) => (
                                      <Accordion
                                        key={index}
                                        sx={{ mb: 2 }}
                                        defaultExpanded
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`experience-${index}-content`}
                                          id={`experience-${index}-header`}
                                        >
                                          <Grid
                                            container
                                            alignItems="center"
                                            spacing={2}
                                          >
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
                                                  values.experienceDetails[
                                                    index
                                                  ].txtCompanyName
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
                                                  values.experienceDetails[
                                                    index
                                                  ].txtEmployeeId
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
                                                  values.experienceDetails[
                                                    index
                                                  ].txtJobTitle
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
                                                    values.experienceDetails[
                                                      index
                                                    ].txtStartDate
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
                                                          values
                                                            .experienceDetails[
                                                            index
                                                          ].txtStartDate
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
                                                    values.experienceDetails[
                                                      index
                                                    ].txtEndDate
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
                                                          values
                                                            .experienceDetails[
                                                            index
                                                          ].txtEndDate
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
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlCountry
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
                                                  values.experienceDetails[
                                                    index
                                                  ].txtCity
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
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlState
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
                                                  <MenuItem
                                                    key={i}
                                                    value={option}
                                                  >
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
                                                  values.experienceDetails[
                                                    index
                                                  ].ddlEmploymentType
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
                                            {/* <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Supervisor Name"
                                                name={`experienceDetails.${index}.txtSupervisorName`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtSupervisorName
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtSupervisorName`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtSupervisorName`
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                              <TextInput
                                                fullWidth
                                                label="Supervisor Phone No"
                                                type="number"
                                                name={`experienceDetails.${index}.txtSupervisorPhone`}
                                                value={
                                                  values.experienceDetails[
                                                    index
                                                  ].txtSupervisorPhone
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `experienceDetails.${index}.txtSupervisorPhone`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `experienceDetails.${index}.txtSupervisorPhone`
                                                  )
                                                }
                                              />
                                            </Grid> */}
                                          </Grid>
                                        </AccordionDetails>
                                      </Accordion>
                                    )
                                  )}
                                </div>
                              )}
                            </FieldArray>
                          )}
                          {activeStep === 7 && (
                            <>
                              <Box sx={{ px: 5, mt: 4 }}>
                                <Grid
                                  container
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    marginTop: '10px'
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenDocument(true)}
                                    sx={{
                                      mb: 2
                                    }}
                                  >
                                    Add Document Type
                                  </Button>
                                  <PopupAddDocument
                                    open={openDocument}
                                    onClose={() => setOpenDocument(false)}
                                  />
                                </Grid>
                              </Box>
                              <DocumentUploadStep
                                values={values}
                                setFieldValue={setFieldValue}
                                documentTypes={documentTypes}
                                userId={userId}
                                // errors={errors}
                                // touched={touched}
                              />
                            </>
                          )}

                          <CardActions sx={{ mt: 2 }}>
                            {/* Back or Previous Step Button */}

                            <Button
                              color="secondary"
                              variant="contained"
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              {activeStep === 0 ? 'Back' : 'Previous Step'}
                            </Button>

                            <Box sx={{ flex: '1 1 auto' }} />

                            {/* Buttons for Last Step */}
                            {isLastStep && isEmployeeSubModulePresent ? (
                              <Button
                                color="primary"
                                variant="contained"
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleEmployeeSubmit}
                              >
                                Submit
                              </Button>
                            ) : (
                              <>
                                {/* Save and Exit for Step 1 */}
                                {/* {activeStep === 1 && (
                                  <Button
                                    color="success"
                                    variant="contained"
                                    type="button"
                                    onClick={handleSaveAndExit}
                                  >
                                    Save and Exit
                                  </Button>
                                )} */}
                                {!(
                                  activeStep === 0 ||
                                  activeStep === 1 ||
                                  activeStep === steps.length - 1
                                ) && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                      setActiveStep((prev) => prev + 1)
                                    }
                                  >
                                    Skip & Next
                                  </Button>
                                )}

                                {/* Save and Next Step */}
                                {!isLastStep && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                  >
                                    Save & Next
                                  </Button>
                                )}
                              </>
                            )}
                          </CardActions>
                        </Form>
                      </>
                    );
                  }}
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

export default CreateEmployee;
