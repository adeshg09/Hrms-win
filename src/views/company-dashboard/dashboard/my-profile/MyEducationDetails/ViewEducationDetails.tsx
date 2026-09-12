import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeEducationDetailsFormValues } from 'models/company/employee';
import {
  getEmployeeEducationDetailsByUserIdRequest,
  deleteEmployeeEducationDetailsById
} from 'services/company/employee/educationDetails';
import Loader from 'components/Loader';
import styles from './education.style';

interface IViewEducationDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// const emptyEducation: EditEmployeeEducationDetailsFormValues = {
//   ddlCourse: 'graduation',
//   txtDegreeSpecialization: '',
//   txtInstituteName: '',
//   txtFromDate: '',
//   txtToDate: '',
//   ddlStatus: '',
//   ddlStudyMode: '',
//   txtPercentage: '',
//   txtId: null
// };

const ViewEducationDetails = ({
  handleViewMode
}: IViewEducationDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [
    initialValuesEducationDetailsEntries,
    setInitialValuesEducationDetailsEntries
  ] = useState<EditEmployeeEducationDetailsFormValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleGetEducationDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeEducationDetailsByUserIdRequest(
        Number(user?.id)
      );
      const educationDetailsData: any = response?.employeeEducationalDetails;
      if (educationDetailsData && educationDetailsData.length > 0) {
        setInitialValuesEducationDetailsEntries(
          educationDetailsData.map((education: any) => ({
            ddlCourse: education.course || 'graduation',
            txtDegreeSpecialization: education.degree_specialization || '',
            txtInstituteName: education.institute_name || '',
            txtFromDate: education.from_date || '',
            txtToDate: education.to_date || '',
            ddlStatus: education.status || '',
            ddlStudyMode: education.study_mode || '',
            txtPercentage: education.percentage || '',
            txtId: education.id
          }))
        );
        // console.log('here all data', initialValuesEducationDetailsEntries);
      } else {
        setInitialValuesEducationDetailsEntries([]);
      }
    } catch (error) {
      console.error('Error fetching education details:', error);
      setInitialValuesEducationDetailsEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const hasValue = (value: string | number): boolean => {
    return value !== '' && value !== undefined && value !== null;
  };

  const viewItem = (
    title: string,
    value: string | number
  ): JSX.Element | null => {
    if (!hasValue(value)) return null;
    return (
      <Grid container spacing={1} sx={styles.viewItemGrid}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={styles.viewItemLabel}>
            {title}:
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" sx={styles.viewItemValue}>
            {value}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const hasEducationData = (
    education: EditEmployeeEducationDetailsFormValues
  ): boolean => {
    return Object.entries(education).some(
      ([key, value]) => key !== 'ddlCourse' && hasValue(value)
    );
  };

  const handleDeleteClick = (index: number | null): void => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (deleteIndex !== null) {
      try {
        // const entryToDelete = initialValuesEducationDetailsEntries[deleteIndex];
        await deleteEmployeeEducationDetailsById(deleteIndex);

        // Remove from local state after successful deletion
        setInitialValuesEducationDetailsEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.txtId !== deleteIndex)
        );
        // console.log('delete ho gya hai');
        setDeleteIndex(null);
      } catch (error) {
        console.error('Error deleting education entry:', error);
      }
    }
    setOpenConfirm(false);
  };

  const renderEducationDetailsAccordion = (
    education: EditEmployeeEducationDetailsFormValues,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`education-details-${index}-content`}
        id={`education-details-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <SchoolIcon sx={{ marginRight: '8px' }} />
          {(education.ddlCourse || 'Graduation').charAt(0).toUpperCase() +
            (education.ddlCourse || 'Graduation').slice(1)}{' '}
          Education Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Degree Specialization', education.txtDegreeSpecialization)}
          {viewItem('Institute Name', education.txtInstituteName)}
          {viewItem('From Date', education.txtFromDate)}
          {viewItem('To Date', education.txtToDate)}
          {viewItem(
            'Status',
            education.ddlStatus.charAt(0).toUpperCase() +
              education.ddlStatus.slice(1).toLowerCase()
          )}
          {viewItem(
            'Study Mode',
            education.ddlStudyMode.charAt(0).toUpperCase() +
              education.ddlStudyMode.slice(1).toLowerCase()
          )}
          {viewItem('GPA/Score', education.txtPercentage)}
        </Box>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteClick(education.txtId ?? null)}
          sx={{ mt: 2 }}
        >
          Delete
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetEducationDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update education details."
            title="Education Details"
            sx={styles.cardHeader}
            titleTypographyProps={{ variant: 'h3', component: 'h3' }}
          />
          {/* <Box sx={styles.editProfile}>
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
                Edit
              </Button>
            )}
          </Box> */}

          <Box sx={styles.editProfile}>
            <Button
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              onClick={() => handleViewMode(true)}
              startIcon={<EditIcon />}
              disabled={loading}
              sx={styles.editlogo}
            >
              Edit
            </Button>
          </Box>
          <Divider />
          {loading && <Loader />}

          {!loading &&
            (initialValuesEducationDetailsEntries.length === 0 ||
              !initialValuesEducationDetailsEntries.some(hasEducationData)) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">No record available</Typography>
              </Box>
            )}

          {!loading &&
            initialValuesEducationDetailsEntries.length > 0 &&
            initialValuesEducationDetailsEntries.some(hasEducationData) && (
              <Box sx={styles.educationDetailsContainer}>
                {initialValuesEducationDetailsEntries.map((education, index) =>
                  hasEducationData(education)
                    ? renderEducationDetailsAccordion(education, index)
                    : null
                )}
              </Box>
            )}
        </Card>
      </Grid>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this emergency contact?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewEducationDetails;
