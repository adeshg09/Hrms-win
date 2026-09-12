/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create side bar/drawer for admin dashboard pages.
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
import { memo, useContext, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Link,
  List,
  Stack,
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

/* Local Imports */
import { SidebarItem } from '.';
import masterSidebarConfig, {
  // companyContentManagerSidebarConfig,
  // companyProjectLeaderSidebarConfig,
  companySidebarConfig,
  // companyUserSidebarConfig,
  GetSidebarItemsBasedOnSubModules,
  masterContentManagerSidebarConfig
} from '../helper/sidebarConfig';
import { SidebarItemProps } from './SidebarItem';
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create side bar/drawer for all admin pages.
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
 * Side bar/drawer for all admin pages.
 *
 * @component
 * @param {boolean} openMobile - flag to check if drawer is open/close
 * @param {function} onMobileClose - callback function to change the state of openMobile
 * @returns {JSX.Element}
 */
// function Sidebar({ openMobile, onMobileClose }) {
const Sidebar = ({ openMobile, onMobileClose }: SidebarProps): JSX.Element => {
  /* Hooks */
  const theme = useTheme();
  const location = useLocation();
  const laptopDownMatches = useMediaQuery(
    theme.breakpoints.down(breakpoints.values.laptop)
  );
  const { isAuthenticated, user, primaryAccessRole, companySubmodules } =
    useContext(SessionContext);

  /* Constants */
  const roleName =
    user?.profile?.roles.length > 0 ? user?.profile?.roles[0]?.name : 'Guest';

  let sidebarPages: Array<SidebarItemProps> = [];
  if (user.company_id > 0) {
    if (primaryAccessRole === 'admin') {
      // sidebarPages = [...companySidebarConfig, ...companyUserSidebarConfig];
      sidebarPages = [...companySidebarConfig];
      // } else if (primaryAccessRole === 'contentManager') {
      //   sidebarPages = [
      //     ...companyContentManagerSidebarConfig,
      //     ...companyUserSidebarConfig
      //   ];
      //   if (user.profile?.is_project_leader) {
      //     sidebarPages = [...sidebarPages, ...companyProjectLeaderSidebarConfig];
      //   }
      // } else if (primaryAccessRole === 'user') {
      //   sidebarPages = user.profile?.is_project_leader
      //     ? [...companyUserSidebarConfig, ...companyProjectLeaderSidebarConfig]
      //     : [...companyUserSidebarConfig];
    }
    sidebarPages = [
      ...sidebarPages,
      ...GetSidebarItemsBasedOnSubModules(
        user?.companySubModules || [],
        primaryAccessRole,
        companySubmodules || []
      )
    ]; // to pass submodules from context
  } else if (primaryAccessRole === 'admin') {
    sidebarPages = [...masterSidebarConfig];
  } else if (primaryAccessRole === 'contentManager') {
    sidebarPages = [...masterContentManagerSidebarConfig];
  }

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
              {`${user.first_name} ${user.last_name}`}
            </Typography>
          </Link>

          <Typography variant="body2" color="text.secondary">
            {roleName}
          </Typography>
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
                subItems={item.subItems}
              />
            ))}
          </List>
        </Scrollbar>
      </Box>
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
