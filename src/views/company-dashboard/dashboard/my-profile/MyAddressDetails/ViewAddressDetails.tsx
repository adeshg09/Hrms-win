import {
  // Accordion,
  // AccordionSummary,
  // AccordionDetails,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  // ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  // Home as HomeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import SessionContext from 'context/SessionContext';
import { EditEmployeeAddressDetailsFormValues } from 'models/company/employee';
import {
  deleteEmployeeAddressDetailRequest,
  getEmployeeAddressDetailsByUserIdRequest
} from 'services/company/employee/addressDetails';
import { countries } from 'constants/appConstant';
import Loader from 'components/Loader';
import styles from './address.style';

interface IViewAddressDetailsProps {
  handleViewMode: (newEditMode: boolean) => void;
}

const ViewAddressDetails = ({
  handleViewMode
}: IViewAddressDetailsProps): JSX.Element => {
  const { user } = useContext(SessionContext);
  const [
    initialValuesAddressDetailsEntries,
    setInitialValuesAddressDetailsEntries
  ] = useState<EditEmployeeAddressDetailsFormValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[] | []>([]);
  const [addressDetails, setAddressDetails] = useState<
    EditEmployeeAddressDetailsFormValues[]
  >([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleCountryChange = (countryCode: string): void => {
    const selectedCountry = countries.find((x) => x.alpha2Code === countryCode);
    setStates(selectedCountry ? selectedCountry.states : []);
  };

  const handleGetAddressDetails = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getEmployeeAddressDetailsByUserIdRequest(
        Number(user?.id)
      );
      const addressDetailsData: any = response?.employeeAddresses;
      setAddressDetails(addressDetailsData);
      const companyCountryAlphaCode =
        countries.find(
          (x) => x.country === addressDetailsData.country?.trim() || ''
        )?.alpha2Code || '';
      handleCountryChange(companyCountryAlphaCode);

      if (addressDetailsData && addressDetailsData.length > 0) {
        setInitialValuesAddressDetailsEntries(
          addressDetailsData.map((address: any) => ({
            ddlAddressType: address.address_type || 'permanent',
            txtBuildingName: address.building_name || '',
            txtFlatNumber: address.flat_number || '',
            txtStreetName: address.street_name || '',
            txtLandmark: address.landmark || '',
            txtCity: address.city || '',
            ddlState: address.state || '',
            ddlCountry: companyCountryAlphaCode,
            txtPincode: address.pincode || '',
            txtTelephoneNumber: address.telephone_number || '',
            txtPhone: address.phone || '',
            txtId: address.id || null
          }))
        );
      } else {
        setInitialValuesAddressDetailsEntries([]);
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      setInitialValuesAddressDetailsEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (index: number): void => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleConfirmDeleteAddressDetail = async (): Promise<void> => {
    if (deleteIndex !== null) {
      const addressDetail = initialValuesAddressDetailsEntries[deleteIndex];
      console.log(addressDetail.txtId);
      if (addressDetail?.txtId !== null && addressDetail?.txtId !== undefined) {
        try {
          await deleteEmployeeAddressDetailRequest(addressDetail.txtId);
          setInitialValuesAddressDetailsEntries((prevEntries) =>
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

  const hasValue = (value: string | number): boolean => {
    return value !== '' && value !== undefined && value !== null;
  };

  // const viewItem = (
  //   title: string,
  //   value: string | number
  // ): JSX.Element | null => {
  //   if (!hasValue(value)) return null;
  //   return (
  //     <Grid container spacing={1} sx={styles.viewItemGrid}>
  //       <Grid item xs={4}>
  //         <Typography variant="subtitle1" sx={styles.viewItemLabel}>
  //           {title}:
  //         </Typography>
  //       </Grid>
  //       <Grid item xs={8}>
  //         <Typography variant="body1" sx={styles.viewItemValue}>
  //           {value}
  //         </Typography>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  const hasAddressData = (
    address: EditEmployeeAddressDetailsFormValues
  ): boolean => {
    return Object.entries(address).some(
      ([key, value]) => key !== 'ddlAddressType' && hasValue(value)
    );
  };

  // const renderAddressDetailsAccordion = (
  //   address: EditEmployeeAddressDetailsFormValues,
  //   index: number
  // ): JSX.Element => (
  //   <Accordion key={index} sx={styles.accordion} defaultExpanded>
  //     <AccordionSummary
  //       expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
  //       aria-controls={`address-details-${index}-content`}
  //       id={`address-details-${index}-header`}
  //       sx={styles.accordionSummary}
  //     >
  //       <Typography variant="h6" display="flex" alignItems="center">
  //         <HomeIcon sx={{ marginRight: '8px' }} />
  //         {(address.ddlAddressType || 'Permanent').charAt(0).toUpperCase() +
  //           (address.ddlAddressType || 'Permanent').slice(1)}{' '}
  //         Address
  //       </Typography>
  //     </AccordionSummary>
  //     <AccordionDetails sx={styles.accordionDetails}>
  //       <Box sx={styles.accordionDetails}>
  //         {viewItem('Building Name', address.txtBuildingName)}
  //         {viewItem('Flat Number', address.txtFlatNumber)}
  //         {viewItem('Street Name', address.txtStreetName)}
  //         {viewItem('Landmark', address.txtLandmark)}
  //         {viewItem('City', address.txtCity)}
  //         {viewItem('State', address.ddlState)}
  //         {viewItem('Country', address.ddlCountry)}
  //         {viewItem('Pincode', address.txtPincode)}
  //         {viewItem('Phone', address.txtPhone)}
  //       </Box>
  //     </AccordionDetails>
  //   </Accordion>
  // );

  const renderAddressDetailsBox = (
    address: EditEmployeeAddressDetailsFormValues,
    index: number
  ): string => {
    // Only render if there's meaningful address data
    const addressTypes = ['Present', 'Permanent'];

    // Validate index
    // if (index < 0 || index >= addressTypes.length) {
    //   throw new Error(
    //     `Invalid address index. Must be 0 (Present) or 1 (Permanent).`
    //   );
    // }

    // Get the address type based on index
    const addressType = addressTypes[index];

    // Primary address components (first line)
    const addressComponents = [
      hasValue(address.txtFlatNumber) ? address.txtFlatNumber : null,
      hasValue(address.txtBuildingName) ? address.txtBuildingName : null,
      hasValue(address.txtStreetName) ? address.txtStreetName : null,
      hasValue(address.txtCity) ? address.txtCity : null,
      hasValue(address.ddlState) ? address.ddlState : null,
      hasValue(address.txtPincode) ? address.txtPincode : null
    ].filter((component) => component !== null);

    // Additional details (second line)
    const additionalDetails = [
      hasValue(address.ddlCountry) ? `Country: ${address.ddlCountry}` : null,
      hasValue(address.txtLandmark) ? `Landmark: ${address.txtLandmark}` : null,
      hasValue(address.txtPhone) ? `Phone: ${address.txtPhone}` : null
    ].filter((component) => component !== null);

    // Combine primary address components
    const formattedAddress = addressComponents.join(' , ');

    // Combine additional details
    const additionalDetailsString =
      additionalDetails.length > 0 ? `\n${additionalDetails.join(' | ')}` : '';

    // Return formatted address with additional details
    return `${addressType} Address: ${formattedAddress}${additionalDetailsString}`;
  };

  useEffect(() => {
    handleGetAddressDetails();
  }, []);

  return (
    <Box>
      <Grid item lg={12} md={12} xs={12}>
        <Card sx={styles.card}>
          <CardHeader
            subheader="Please use edit to update address details."
            title="Address Details"
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

          {!loading && addressDetails.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1">No record available</Typography>
            </Box>
          )}
          {!loading && initialValuesAddressDetailsEntries.length > 0 && (
            <>
              {/* <Typography variant="h4" gutterBottom sx={{ mb: 4, px: 4 }}>
              Address Details
            </Typography> */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  px: 4,
                  my: 4
                }}
              >
                {initialValuesAddressDetailsEntries
                  .filter((address) => hasAddressData(address))
                  .map((address, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,

                        minWidth: 0 // Prevents overflow
                      }}
                    >
                      {renderAddressDetailsBox(address, index)}
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(index)}
                        sx={{ mt: 2, width: '20%' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}
              </Box>
            </>
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
          <Button onClick={handleConfirmDeleteAddressDetail}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewAddressDetails;
