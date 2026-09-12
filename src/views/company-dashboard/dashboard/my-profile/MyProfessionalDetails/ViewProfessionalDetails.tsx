import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';

import SessionContext from 'context/SessionContext';
import {
  AddEmployeeProfessionalDetailsFormValues,
  ProfessionalDetailsValues
} from 'models/company/employee';
import { getEmployeeProfessionalDetailsByUserIdRequest } from 'services/company/employee/professionalDetails';
import { getDesignationByIdRequest } from 'services/company/designation';
import Loader from 'components/Loader';
import { getUserByIdRequest } from 'services/company/employee/accountSetup';
import styles from './index.style';

interface IViewProfessionalDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// Default empty professional details
const emptyProfessionalDetails: AddEmployeeProfessionalDetailsFormValues = {
  txtEmployeeCode: '',
  ddlDesignation: '',
  ddlReportingUser: '',
  txtJoinDate: '',
  ddlEmploymentType: '',
  ddlWorkingType: ''
};

const ViewProfessionalDetails = ({
  handleViewMode
}: IViewProfessionalDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [
    initialValuesProfessionalDetails,
    setInitialValuesProfessionalDetails
  ] = useState<AddEmployeeProfessionalDetailsFormValues>(
    emptyProfessionalDetails
  );

  const handleGetProfessionalDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeProfessionalDetailsByUserIdRequest(
        Number(user?.id)
      );
      const professionalData: ProfessionalDetailsValues =
        response?.employeeProfessionalDetail;

      if (professionalData) {
        try {
          const { designation } = await getDesignationByIdRequest(
            Number(professionalData.designation_id)
          );

          const { user: reportingUser } = await getUserByIdRequest(
            Number(professionalData?.reporting_user_id)
          );

          setInitialValuesProfessionalDetails({
            txtEmployeeCode: professionalData.employee_code || '',
            ddlDesignation: designation?.name || '',
            ddlReportingUser: reportingUser?.first_name,
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

  const viewItem = (title: string, value: any): JSX.Element => (
    <Grid container spacing={0} sx={styles.mainGrid} p={2}>
      <Grid item md={4} sm={4} xs={4} pr={2}>
        <Typography
          variant="h6"
          sx={{
            justifyContent: 'flex-start'
          }}
        >
          {title} :
        </Typography>
      </Grid>
      <Grid item md={8} sm={8} xs={8}>
        <Typography variant="body1">{value || 'Not provided'}</Typography>
      </Grid>
    </Grid>
  );

  const hasAnyData = (): boolean => {
    return Object.values(initialValuesProfessionalDetails).some(
      (value) => value !== ''
    );
  };

  useEffect(() => {
    handleGetProfessionalDetails();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.profileParent}>
          <CardHeader
            subheader="Please use edit to update professional details."
            title="Professional Details"
            sx={styles.cardHeaderEdit}
            titleTypographyProps={{ variant: 'h3', component: 'h3' }}
          />
          <Box sx={styles.editProfile}>
            {user?.profile.roles.some(
              (role: any) => role.name === 'Admin' || role.name === 'Hr'
            ) && (
              <Button
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                onClick={() => handleViewMode(true)}
                startIcon={<EditIcon />}
                disabled={loading}
              >
                {' '}
                Edit{' '}
              </Button>
            )}
          </Box>
          <Divider />
          <CardContent style={{ textAlign: 'center' }}>
            {loading && <Loader />}

            {!loading && !hasAnyData() && (
              <Typography variant="body1" sx={{ py: 4 }}>
                No record available
              </Typography>
            )}

            {!loading && hasAnyData() && (
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  {viewItem(
                    'Employee Code',
                    initialValuesProfessionalDetails.txtEmployeeCode
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Designation',
                    initialValuesProfessionalDetails.ddlDesignation
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Reporting Manager',
                    initialValuesProfessionalDetails.ddlReportingUser
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Joining Date',
                    initialValuesProfessionalDetails.txtJoinDate
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Employment Type',
                    initialValuesProfessionalDetails.ddlEmploymentType
                  )}
                </Grid>
                <Grid item xs={12}>
                  {viewItem(
                    'Working Type',
                    initialValuesProfessionalDetails.ddlWorkingType
                  )}
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default ViewProfessionalDetails;
