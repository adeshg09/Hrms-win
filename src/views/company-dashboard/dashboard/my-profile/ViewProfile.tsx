/* Imports */
import {
  Box,
  // Button,
  Grid,
  Typography,
  // List,
  // ListItem,
  styled,
  Chip
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
// import { Edit as EditIcon } from '@mui/icons-material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import {
  AddEmployeeProfessionalDetailsFormValues,
  ProfessionalDetailsValues
} from 'models/company/employee';
import { getEmployeeProfessionalDetailsByUserIdRequest } from 'services/company/employee/professionalDetails';
import { getDesignationByIdRequest } from 'services/company/designation';
import { getUserByIdRequest } from 'services/company/user';

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

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1)
}));

interface IViewProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty professional details
const emptyProfessionalDetails = {
  txtEmployeeCode: '',
  ddlDesignation: '',
  ddlReportingUser: '',
  txtJoinDate: '',
  ddlEmploymentType: '',
  ddlWorkingType: ''
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
  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState<typeof emptyProfessionalDetails>(emptyProfessionalDetails);

  const handleGetProfessionalDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeProfessionalDetailsByUserIdRequest(
        Number(user?.id)
      );
      console.log('Professional details response', response);
      const professionalData: ProfessionalDetailsValues =
        response?.employeeProfessionalDetail;

      if (professionalData) {
        try {
          const { designation } = await getDesignationByIdRequest(
            Number(professionalData.designation_id)
          );
          console.log('designation', designation);

          const { user: reportingUser } = await getUserByIdRequest(
            Number(professionalData?.reporting_user_id)
          );
          const reportingManagerFirstname = reportingUser?.first_name;
          const reportingManagerLastname = reportingUser?.last_name;

          const reportingManagerFullname =
            reportingManagerFirstname && reportingManagerLastname
              ? `${reportingManagerFirstname} ${reportingManagerLastname}`
              : reportingManagerFirstname || reportingManagerLastname;

          setInitialValuesProfessionalDetails({
            txtEmployeeCode: professionalData.employee_code || '',
            ddlDesignation: designation?.name || '',
            ddlReportingUser: reportingManagerFullname || '',
            txtJoinDate: professionalData.joining_date || '',
            ddlEmploymentType: professionalData.employment_type || '',
            ddlWorkingType: professionalData.working_type || ''
          });
        } catch (error) {
          console.error('Error fetching designation:', error);
          setInitialValuesProfessionalDetails({
            ...emptyProfessionalDetails,
            txtEmployeeCode: professionalData.employee_code || '',
            txtJoinDate: professionalData.joining_date || '',
            ddlEmploymentType: professionalData.employment_type || '',
            ddlWorkingType: professionalData.working_type || ''
          });
        }
      } else {
        setInitialValuesProfessionalDetails(emptyProfessionalDetails);
      }
    } catch (error) {
      console.error('Error fetching professional details:', error);
      setInitialValuesProfessionalDetails(emptyProfessionalDetails);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProfessionalDetails();
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewMode(true)}
          startIcon={<EditIcon />}
        >
          Edit Profile
        </Button>
      </Box> */}

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Profile Information
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">First Name</InfoLabel>
            <InfoValue variant="body1">{user.first_name}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Last Name</InfoLabel>
            <InfoValue variant="body1">{user.last_name}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Email</InfoLabel>
            <InfoValue variant="body1">{user.email}</InfoValue>
          </Grid>

          {user?.profile?.roles && user.profile.roles.length > 0 && (
            <Grid item xs={12} sm={6}>
              <InfoLabel variant="subtitle2">Roles</InfoLabel>
              <ChipContainer>
                {user.profile.roles.map((role: any) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    size="medium"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </ChipContainer>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Employee Code</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.txtEmployeeCode}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Designation</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.ddlDesignation}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Reporting Manager</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.ddlReportingUser}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Joining Date</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.txtJoinDate}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Employment Type</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.ddlEmploymentType}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoLabel variant="subtitle2">Working Type</InfoLabel>
            <InfoValue variant="body1">
              {initialValuesProfessionalDetails.ddlWorkingType}
            </InfoValue>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewProfile;
