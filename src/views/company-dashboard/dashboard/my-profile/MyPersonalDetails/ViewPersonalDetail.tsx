/* Imports */
import {
  Box,
  Button,
  Grid,
  Typography,
  // List,
  // ListItem,
  styled,
  // Chip,
  CardHeader,
  Divider
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import {
  AddEmployeePersonalDetailsFormValues,
  // AddEmployeeProfessionalDetailsFormValues,
  PersonalDetailsValues
  // ProfessionalDetailsValues
} from 'models/company/employee';
// import { getEmployeeProfessionalDetailsByUserIdRequest } from 'services/company/employee/professionalDetails';
// import { getDesignationByIdRequest } from 'services/company/designation';
// import { getUserByIdRequest } from 'services/master/user';
import { countries } from 'constants/appConstant';
import { getEmployeePersonalDetailsByUserIdRequest } from 'services/company/employee/personalDetails';
import Loader from 'components/Loader';
import styles from './personal.style';

// Styled Components
const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(1)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400
}));

// const ChipContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexWrap: 'wrap',
//   gap: theme.spacing(1)
// }));

interface IViewProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty professional details
const emptyPersonalDetails: AddEmployeePersonalDetailsFormValues = {
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
};

/**
 * Component to display profile information
 *
 * @component
 * @returns {JSX.Element}
 */
const ViewProfile = ({ handleViewMode }: IViewProfileProps): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);
  console.log('userALlDetilas', user);
  const [loading, setLoading] = useState(false);
  const [initialValuesPersonalDetails, setInitialValuesPersonalDetails] =
    useState<AddEmployeePersonalDetailsFormValues>(emptyPersonalDetails);
  const [dataExists, setDataExists] = useState(false);

  const handleGetPersonalDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeePersonalDetailsByUserIdRequest(
        Number(user?.id)
      );
      const personalDetailsData: PersonalDetailsValues =
        response?.employeePersonalDetail;

      if (personalDetailsData) {
        const country =
          countries.find(
            (x) => x.alpha2Code === personalDetailsData.birth_country?.trim()
          )?.country || '';

        // Calculate age
        const calculateAge = (birthDate: string): number => {
          if (!birthDate) return 0;

          const today = new Date();
          const birthDateObj = new Date(birthDate);

          let age = today.getFullYear() - birthDateObj.getFullYear();
          const monthDifference = today.getMonth() - birthDateObj.getMonth();

          if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
          ) {
            age--;
          }

          return age;
        };
        setInitialValuesPersonalDetails({
          txtBirthDate: personalDetailsData.birth_date || '',
          txtAge: calculateAge(personalDetailsData.birth_date) || 0,
          ddlBirthCountry: country || '',
          ddlBirthState: personalDetailsData.birth_state || '',
          txtBirthLocation: personalDetailsData.birth_location || '',
          ddlGender: personalDetailsData.gender || '',
          ddlMaritalStatus: personalDetailsData.marital_status || '',
          txtMarriageDate: personalDetailsData.marriage_date || '',
          ddlBloodGroup: personalDetailsData.blood_group || '',
          txtPanNumber: personalDetailsData.pan_number || '',
          txtCaste: personalDetailsData.caste || '',
          txtReligion: personalDetailsData.religion || '',
          txtResidence: personalDetailsData.residence || ''
        });

        setDataExists(true);
      } else {
        setInitialValuesPersonalDetails(emptyPersonalDetails);
        setDataExists(false);
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      setInitialValuesPersonalDetails(emptyPersonalDetails);
      setDataExists(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPersonalDetails();
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <CardHeader
        subheader="Please use edit to update personal details."
        title="Personal Details"
        sx={styles.cardHeaderEdit}
        titleTypographyProps={{ variant: 'h3', component: 'h3' }}
      />
      <Box sx={styles.editProfile}>
        <Button
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          onClick={() => handleViewMode(true)}
          startIcon={<EditIcon />}
          disabled={loading}
        >
          Edit{' '}
        </Button>
      </Box>

      <Divider />

      {loading && <Loader />}

      {!loading && dataExists && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Profile Information
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Birth Date</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtBirthDate}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Age</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtAge}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Birth Country</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.ddlBirthCountry}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Birth State</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.ddlBirthState}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Birth Location</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtBirthLocation}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Gender</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.ddlGender}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Marriage Status</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.ddlMaritalStatus}
              </InfoValue>
            </Grid>

            {initialValuesPersonalDetails.ddlMaritalStatus !== 'single' && (
              <Grid item xs={12} sm={6}>
                <InfoLabel variant="subtitle2">Marriage Date</InfoLabel>
                <InfoValue variant="body1">
                  {initialValuesPersonalDetails.txtMarriageDate}
                </InfoValue>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Blood Group</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.ddlBloodGroup}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Pan Number</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtPanNumber}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Caste</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtCaste}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Religion</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtReligion}
              </InfoValue>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Residence</InfoLabel>
              <InfoValue variant="body1">
                {initialValuesPersonalDetails.txtResidence}
              </InfoValue>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ViewProfile;
