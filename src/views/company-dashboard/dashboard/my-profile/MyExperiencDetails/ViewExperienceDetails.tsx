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
  Work as WorkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import {
  getEmployeeExperienceDetailsByUserIdRequest,
  deleteEmployeeExperienceDetailsById
} from 'services/company/employee/experienceDetails';
import styles from './experience.style';

interface IViewExperienceDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

const emptyExperience = {
  companyName: '',
  employeeId: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  country: '',
  city: '',
  state: '',
  employmentType: '',
  supervisorName: '',
  supervisorPhone: '',
  id: null
};

const ViewExperienceDetails = ({
  handleViewMode
}: IViewExperienceDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);

  const hasValue = (value: string | number): boolean =>
    value !== '' && value !== undefined && value !== null;

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

  const hasExperienceData = (experience: typeof emptyExperience): boolean => {
    return Object.entries(experience).some((_, value) =>
      hasValue(value as string | number)
    );
  };

  const handleGetExperienceDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeExperienceDetailsByUserIdRequest(
        Number(user?.id)
      );
      console.log('Experience details response', response);
      const experienceData = response?.employeeExperienceDetails;

      if (experienceData && experienceData.length > 0) {
        setExperienceDetails(
          experienceData.map((experience: any) => ({
            companyName: experience.company_name || '',
            employeeId: experience.employee_id || '',
            jobTitle: experience.job_title || '',
            startDate: experience.start_date || '',
            endDate: experience.end_date || '',
            country: experience.country || '',
            city: experience.city || '',
            state: experience.state || '',
            employmentType: experience.employment_type || '',
            id: experience.id || null
          }))
        );
      } else {
        setExperienceDetails([]);
      }
    } catch (error) {
      console.error('Error fetching experience details:', error);
      setExperienceDetails([]);
    } finally {
      console.log('experienceDetails', experienceDetails);
      setLoading(false);
    }
  };

  const handleDeleteExperience = (index: number): void => {
    setSelectedExperienceIndex(index);
    setOpenConfirmDialog(true);
  };

  const confirmDeleteExperience = async (): Promise<void> => {
    if (selectedExperienceIndex !== null) {
      const experience = experienceDetails[
        selectedExperienceIndex
      ] as typeof emptyExperience;
      if (experience?.id !== null && experience?.id !== undefined) {
        try {
          await deleteEmployeeExperienceDetailsById(experience.id);
          setExperienceDetails((prevExperiences) =>
            prevExperiences.filter((_, i) => i !== selectedExperienceIndex)
          );
        } catch (error) {
          console.error('Error deleting experience:', error);
        }
      }
    }
    setOpenConfirmDialog(false);
  };

  const renderExperienceAccordion = (
    experience: typeof emptyExperience,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`experience-${index}-content`}
        id={`experience-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <WorkIcon sx={{ marginRight: '8px' }} />
          {experience.companyName
            ? `${experience.companyName} Experience`
            : `Experience ${index + 1}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Company Name', experience.companyName)}
          {viewItem('Employee ID', experience.employeeId)}
          {viewItem('Job Title', experience.jobTitle)}
          {viewItem('Start Date', experience.startDate)}
          {viewItem('End Date', experience.endDate)}
          {viewItem('Country', experience.country)}
          {viewItem('City', experience.city)}
          {viewItem('State', experience.state)}
          {viewItem('Employment Type', experience.employmentType)}
        </Box>
        <Button
          size="small"
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteExperience(index)}
          sx={{ ml: 'auto' }}
        >
          Delete
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetExperienceDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update experience details."
            title="Experience Details"
            sx={styles.cardHeader}
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
              Edit
            </Button>
          </Box>
          <Divider />
          {loading && <Loader />}

          {!loading &&
            (experienceDetails.length === 0 ||
              !experienceDetails.some(hasExperienceData)) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">No record available</Typography>
              </Box>
            )}

          {!loading &&
            experienceDetails.length > 0 &&
            experienceDetails.some(hasExperienceData) && (
              <Box sx={styles.experienceDetailsContainer}>
                {experienceDetails.map((experience, index) =>
                  hasExperienceData(experience)
                    ? renderExperienceAccordion(experience, index)
                    : null
                )}
              </Box>
            )}
        </Card>
      </Grid>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this experience?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteExperience}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewExperienceDetails;
