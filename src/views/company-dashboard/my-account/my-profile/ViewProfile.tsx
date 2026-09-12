/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description View page to display all the user details
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Theme,
  Typography,
  List,
  ListItem
} from '@mui/material';
import { useContext } from 'react';
import {
  Edit as EditIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------
interface IViewProfileProps {
  handleViewMode: (newEditMode: boolean) => void;
}

// ----------------------------------------------------------------------

/**
 * Component to create the my account page.
 *
 * @component
 * @returns {JSX.Element}
 */
const ViewProfile = ({ handleViewMode }: IViewProfileProps): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);
  console.log(user, 'user');
  /**
   * component to create the view item
   *
   * @component
   * @returns {JSX.Element}
   */
  const viewItem = (title: any, value: any): JSX.Element => (
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
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </Grid>
  );

  /* Output */
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
            subheader="Please use edit to update profile info."
            title="Profile Information"
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
            >
              <EditIcon />
            </Button>
          </Box>
          <Divider />
          <CardContent style={{ textAlign: 'left' }}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                {viewItem('First Name', user.first_name)}
              </Grid>
              <Grid item xs={12}>
                {viewItem('Last Name', user.last_name)}
              </Grid>
              <Grid item xs={12}>
                {viewItem('Email', user.email)}{' '}
              </Grid>
              <Grid item xs={12}>
                {user.ip_address && (
                  <>{viewItem('Ip Address', user.ip_address)}</>
                )}
              </Grid>
              <Grid item xs={12}>
                {user.employee_code && (
                  <>{viewItem('Employee Code', user.employee_code)}</>
                )}
              </Grid>
              <Grid item xs={12}>
                {user.phone && <>{viewItem('Phone Number', user.phone)}</>}
              </Grid>
              <Grid item xs={12}>
                {user.roles && (
                  <>
                    {viewItem(
                      'Roles',
                      <>
                        <List disablePadding>
                          {user.roles.map((item: any) => (
                            <ListItem key={item.id} disablePadding>
                              <ChevronRightIcon />
                              <span>{item.name}</span>
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};
export default ViewProfile;
