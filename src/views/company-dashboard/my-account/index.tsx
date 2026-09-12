/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description My Account Page to handle the user profile.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  LockOpen as LockOpenIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

/* Relative Imports */
import { AccountPage, AdminDashboardPage } from 'components/Page';
import useSnackbarClose from 'hooks/useSnackbarClose';

/* Local Imports */
import ChangePassword from './change-password';
import MyProfile from './my-profile';
import accountStyle from './account.style';

// ----------------------------------------------------------------------

/* Constants */
const tabsData = [
  {
    name: 'My Profile',
    icon: <AccountCircleIcon />,
    disabled: false
  },
  {
    name: 'Security',
    icon: <LockOpenIcon />,
    disabled: false
  }
];

// ----------------------------------------------------------------------

/**
 * Component to create the my account page.
 *
 * @component
 * @returns {JSX.Element}
 */
const MyAccount = (): JSX.Element => {
  /* Hooks */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [value, setValue] = useState(tabsData[0].name);
  const [loading, setLoading] = useState(false);

  /* Functions */
  /**
   * function to change the tab
   * @returns {void}
   */
  const handleChange = (_: any, newValue: string): void => {
    setValue(newValue);
  };

  /* Side-Effects */

  /* Output */
  return (
    <AccountPage title="My Account">
      <TabContext value={value}>
        <AppBar position="static" color="inherit">
          <TabList
            variant="fullWidth"
            onChange={handleChange}
            sx={accountStyle.tabList}
          >
            {tabsData.map((item, index) => (
              <Tab
                key={index}
                label={item.name}
                icon={item.icon}
                value={item.name}
                disabled={item.disabled}
              />
            ))}
          </TabList>
        </AppBar>
        <TabPanel value={tabsData[0].name} sx={accountStyle.tabPanel}>
          <MyProfile />
        </TabPanel>
        <TabPanel value={tabsData[1].name} sx={accountStyle.tabPanel}>
          <ChangePassword />
        </TabPanel>
      </TabContext>
      {/* <Tabs
          //   value={this.state.value}
          //   onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="My Profile" icon={<AccountCircleIcon />} />
          <Tab label="Security" icon={<LockOpenIcon />} />
          <Tab
            label="Notifications (Coming Soon...)"
            icon={<NotificationsIcon />}
            disabled
          />
        </Tabs> */}
      {/* <TabPanel value={this.state.value} index={0}>
        <MyProfile />
      </TabPanel>
      <TabPanel value={this.state.value} index={1}>
        <ChangePassword />
      </TabPanel> */}
    </AccountPage>
  );
};

export default MyAccount;
