/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create side bar/drawer for company dashboard pages.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo, useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  Link,
  List,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import { apiBaseUrl } from 'config/config';
import WebsiteLogo from 'components/WebsiteLogo';
import MyAvatar from 'components/MyAvatar';
import Scrollbar from 'components/Scrollbar';
import breakpoints from 'theme/breakpoints';
import { getInstallerFile } from 'services/company/tracker';

/* Local Imports */
import { SidebarItem } from '.';
import sidebarConfig, {
  SidebarActivityConfig,
  SidebarEmployeeConfig,
  SidebarUserConfig
} from '../helper/sidebarConfig';
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create side bar/drawer for all company pages.
 *
 * @interface SidebarProps
 * @property {boolean} openMobile - flag to check if drawer is open/close
 * @property {function} onMobileClose - callback function to change the state of openMobile
 */
export interface SidebarProps {
  openMobile: boolean;
  onMobileClose: any;
}

// ----------------------------------------------------------------------

/**
 * Side bar/drawer for all company pages.
 *
 * @component
 * @param {boolean} openMobile - flag to check if drawer is open/close
 * @param {function} onMobileClose - callback function to change the state of openMobile
 * @returns {JSX.Element}
 */
const Sidebar = ({ openMobile, onMobileClose }: SidebarProps): JSX.Element => {
  /* Constants */
  const options = ['Windows', 'MacOs', 'Linux'];

  /* Hooks */
  const theme = useTheme();
  const location = useLocation();
  const laptopDownMatches = useMediaQuery(
    theme.breakpoints.down(breakpoints.values.laptop)
  );
  const { isAuthenticated, user } = useContext(SessionContext);

  /* States */
  const [selectedValue, setSelectedValue] = useState('');

  // const sidebarPages = sidebarConfig;
  let sidebarPages = [];
  // if (isAdmin) {
  sidebarPages = [...sidebarConfig, ...SidebarUserConfig];
  // } else if (isProjectLeader) {
  //   sidebarPages = [...SidebarUserConfig, ...SidebarEmployeeConfig];
  // } else if (!showActivity) {
  //   sidebarPages = [...SidebarActivityConfig];
  // } else {
  //   sidebarPages = [...SidebarUserConfig];
  // }

  /* Functions */
  const getFileName = async (
    osName: string,
    companyName: string
  ): Promise<void> => {
    try {
      const response = await getInstallerFile(osName, companyName);
      // console.log(response, 'response');
      if (response) {
        const filePath = response.filePath.replace('public\\', '');
        const fileUrl = `${apiBaseUrl}/${filePath}`;
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = filePath.split('\\').pop();
        anchor.click();
      }
    } catch (error) {
      // console.log(error, 'error');
    }
  };
  /* Side-Effects */

  useEffect(() => {
    if (openMobile) {
      onMobileClose();
    }
  }, [location.pathname]);

  /* Hooks */
  const content = isAuthenticated && user && (
    <Stack height="100%">
      <Box sx={styles.logoContainer}>
        <WebsiteLogo isClickable={false} />
      </Box>
      <Box sx={styles.userProfile}>
        <MyAvatar
          component={RouterLink}
          src={`${apiBaseUrl}${user.profile_photo}`}
          to={PAGE_ROOT.account.absolutePath}
          sx={styles.profilePicture}
        />
        <Box flex={1}>
          <Link
            component={RouterLink}
            underline="none"
            color="text.primary"
            to={PAGE_ROOT.account.absolutePath}
          >
            <Typography variant="subtitle1" noWrap>
              {`${user.first_name} ${user.last_name || ''}`}
            </Typography>
          </Link>
          {/* {(user.roles?.find(
            (item: any) => item.name.toLowerCase() === 'admin'
          ) && (
            <Typography variant="body2" color="text.secondary">
              Admin
            </Typography>
          )) ||
            (!!user.roles?.length && (
              <Typography variant="body2" color="text.secondary">
                {user.roles[0].name}
              </Typography>
            ))} */}
          {user.designation?.name && (
            <Typography variant="body2" color="text.secondary">
              {user.designation.name}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={styles.listContainer}>
        <Scrollbar>
          <List sx={styles.sidebarList}>
            {sidebarPages.map((item, index) => (
              <SidebarItem
                href={item.href}
                key={index}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </List>
        </Scrollbar>
      </Box>
      <Box sx={styles.installerComponent}>
        <TextField
          select
          fullWidth
          size="small"
          label="Select OS Type"
          name="installer"
          variant="outlined"
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
          onChange={(evt) => setSelectedValue(evt.target.value)}
        >
          <option value="">None</option>
          {options.map((opt: any) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </TextField>

        {/* <Button
          color="primary"
          size="medium"
          variant="contained"
          disabled={!selectedValue}
          sx={styles.button}
          // target="_blank"
          onClick={() => {
            getFileName(selectedValue, company.domain_name);
          }}
        >
          Download Installer
        </Button> */}
      </Box>
      {/* <Footer containerStyle={styles.footer} /> */}
    </Stack>
  );

  /* Output */
  return (
    <>
      {laptopDownMatches ? (
        <Drawer
          anchor="left"
          variant="temporary"
          open={openMobile}
          onClose={onMobileClose}
          PaperProps={{
            sx: styles.sidebarDrawer
          }}
        >
          {content}
        </Drawer>
      ) : (
        <Box sx={styles.leftPanel}>{content}</Box>
      )}
    </>
  );
};

export default memo(Sidebar);
