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
  People as PeopleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeFamilyDetailsFormValues } from 'models/company/employee';
import {
  getEmployeeFamilyDetailsByUserIdRequest,
  deleteEmployeeFamilyDetailRequest
} from 'services/company/employee/familyDetails';
// import { countries } from 'constants/appConstant';
import Loader from 'components/Loader';
import styles from './family.style';

interface IViewFamilyDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// const emptyFamilyMember: EditEmployeeFamilyDetailsFormValues = {
//   ddlRelationType: 'family member',
//   txtName: '',
//   txtAge: '',
//   txtBirthDate: '',
//   txtCurrentAddress: '',
//   ddlBirthCountry: '',
//   ddlBirthState: '',
//   txtBirthLocation: '',
//   txtOccupation: '',
//   txtPhone: '',
//   txtId: null
// };

const ViewFamilyDetails = ({
  handleViewMode
}: IViewFamilyDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [
    initialValuesFamilyDetailsEntries,
    setInitialValuesFamilyDetailsEntries
  ] = useState<EditEmployeeFamilyDetailsFormValues[]>([]);
  const [loading, setLoading] = useState(false);
  // const [states, setStates] = useState<string[] | []>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  // const handleCountryChange = (countryCode: string): void => {
  //   const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
  //   setStates(selectedCountry ? selectedCountry.states : []);
  // };

  const handleGetFamilyDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeFamilyDetailsByUserIdRequest(
        Number(user?.id)
      );
      const familyDetailsData: any = response?.employeeFamilyDetails;

      if (familyDetailsData && familyDetailsData.length > 0) {
        setInitialValuesFamilyDetailsEntries(
          familyDetailsData.map((member: any) => ({
            ddlRelationType: member.relation_type || 'family member',
            txtName: member.name || '',
            txtAge: member.age || '',
            txtBirthDate: member.birth_date || '',
            txtCurrentAddress: member.current_address || '',
            ddlBirthCountry: member.birth_country || '',
            ddlBirthState: member.birth_state || '',
            txtBirthLocation: member.birth_location || '',
            txtOccupation: member.occupation || '',
            txtPhone: member.phone || '',
            txtId: member.id
          }))
        );
      } else {
        setInitialValuesFamilyDetailsEntries([]);
      }
    } catch (error) {
      console.error('Error fetching family details:', error);
      setInitialValuesFamilyDetailsEntries([]);
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

  const hasFamilyMemberData = (
    member: EditEmployeeFamilyDetailsFormValues
  ): boolean => {
    return Object.entries(member).some(
      ([key, value]) => key !== 'ddlRelationType' && hasValue(value)
    );
  };

  const handleDeleteClick = (index: number): void => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleConfirmDeleteFamilyDetail = async (): Promise<void> => {
    if (deleteIndex !== null) {
      const familyDetail = initialValuesFamilyDetailsEntries[deleteIndex];
      if (familyDetail?.txtId !== null && familyDetail?.txtId !== undefined) {
        try {
          await deleteEmployeeFamilyDetailRequest(familyDetail.txtId);
          setInitialValuesFamilyDetailsEntries((prevEntries) =>
            prevEntries.filter((_, i) => i !== deleteIndex)
          );
        } catch (error) {
          console.error('Error deleting family detail:', error);
        }
      }
    }
    setDeleteIndex(null);
    setOpenConfirm(false);
  };

  const renderFamilyMemberAccordion = (
    member: EditEmployeeFamilyDetailsFormValues,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`family-member-${index}-content`}
        id={`family-member-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <PeopleIcon sx={{ marginRight: '8px' }} />
          {(member.ddlRelationType || 'Family Member').charAt(0).toUpperCase() +
            (member.ddlRelationType || 'Family Member').slice(1)}{' '}
          Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem(
            'Relation Type',
            member.ddlRelationType.charAt(0).toUpperCase() +
              member.ddlRelationType.slice(1).toLowerCase()
          )}
          {viewItem('Full Name', member.txtName)}
          {viewItem('Occupation', member.txtOccupation)}
          {viewItem('Phone', member.txtPhone)}
        </Box>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteClick(index)}
          sx={{ mt: 2 }}
        >
          Delete
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetFamilyDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update family details."
            title="Family Details"
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
            (initialValuesFamilyDetailsEntries.length === 0 ||
              !initialValuesFamilyDetailsEntries.some(hasFamilyMemberData)) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">No record available</Typography>
              </Box>
            )}

          {!loading &&
            initialValuesFamilyDetailsEntries.length > 0 &&
            initialValuesFamilyDetailsEntries.some(hasFamilyMemberData) && (
              <Box sx={styles.familyDetailsContainer}>
                {initialValuesFamilyDetailsEntries.map((member, index) =>
                  hasFamilyMemberData(member)
                    ? renderFamilyMemberAccordion(member, index)
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
          <Button onClick={handleConfirmDeleteFamilyDetail}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewFamilyDetails;
