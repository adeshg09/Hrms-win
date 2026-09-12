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
  Phone as PhoneIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import {
  getEmployeeEmergencyContactDetailsByUserIdRequest,
  deleteEmployeeEmergencyContactDetailsByUserId
} from 'services/company/employee/emergencyContactDetails';
import styles from './emergencyContact.style';

interface IViewEmergencyContactDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

const emptyEmergencyContact = {
  contactName: '',
  contactAddress: '',
  contactRelation: '',
  phone: '',
  id: null
};

const ViewEmergencyContactDetails = ({
  handleViewMode
}: IViewEmergencyContactDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [emergencyContacts, setEmergencyContacts] = useState([
    emptyEmergencyContact
  ]);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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

  const hasContactData = (contact: typeof emptyEmergencyContact): boolean => {
    return Object.values(contact).some((value) =>
      hasValue(value as string | number)
    );
  };

  const handleGetEmergencyContacts = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeEmergencyContactDetailsByUserIdRequest(
        Number(user?.id)
      );
      const contactsData = response?.employeeEmergencyContacts;
      console.log(contactsData);
      if (contactsData && contactsData.length > 0) {
        setEmergencyContacts(
          contactsData.map((contact: any) => ({
            contactName: contact.contact_name || '',
            contactAddress: contact.contact_address || '',
            contactRelation: contact.contact_relation || '',
            phone: contact.phone || '',
            id: contact.id
          }))
        );
        console.log('emmm', emergencyContacts);
      } else {
        setEmergencyContacts([emptyEmergencyContact]);
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      setEmergencyContacts([emptyEmergencyContact]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (index: number): void => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (deleteIndex !== null) {
      const contact = emergencyContacts[deleteIndex];
      if (contact?.id !== null && contact?.id !== undefined) {
        try {
          await deleteEmployeeEmergencyContactDetailsByUserId(contact.id);
          setEmergencyContacts((prevContacts) =>
            prevContacts.filter((_, i) => i !== deleteIndex)
          );
        } catch (error) {
          console.error('Error deleting emergency contact:', error);
        }
      }
    }
    setDeleteIndex(null);
    setOpenConfirm(false);
  };

  const renderEmergencyContactAccordion = (
    contact: typeof emptyEmergencyContact,
    index: number
  ): JSX.Element => (
    <Accordion key={index} sx={styles.accordion} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
        aria-controls={`emergency-contact-${index}-content`}
        id={`emergency-contact-${index}-header`}
        sx={styles.accordionSummary}
      >
        <Typography variant="h6" display="flex" alignItems="center">
          <PhoneIcon sx={{ marginRight: '8px' }} />
          {contact.contactName
            ? `${contact.contactName} (Emergency Contact)`
            : `Emergency Contact ${index + 1}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <Box sx={styles.accordionDetails}>
          {viewItem('Contact Name', contact.contactName)}
          {viewItem('Contact Address', contact.contactAddress)}
          {viewItem('Relation', contact.contactRelation)}
          {viewItem('Phone', contact.phone)}
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(index)}
            sx={{ mt: 2 }}
          >
            Delete
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    handleGetEmergencyContacts();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update emergency contact details."
            title="Emergency Contact Details"
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
              Edit{' '}
            </Button>
          </Box>
          <Divider />
          {loading && <Loader />}

          {!loading &&
            (emergencyContacts.length === 0 ||
              !emergencyContacts.some(hasContactData)) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">No record available</Typography>
              </Box>
            )}

          {!loading &&
            emergencyContacts.length > 0 &&
            emergencyContacts.some(hasContactData) && (
              <Box sx={styles.emergencyContactDetailsContainer}>
                {emergencyContacts.map((contact, index) =>
                  hasContactData(contact)
                    ? renderEmergencyContactAccordion(contact, index)
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

export default ViewEmergencyContactDetails;
