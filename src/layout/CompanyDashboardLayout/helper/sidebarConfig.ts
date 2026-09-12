/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define tabs for sidebar.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import {
  AccountTree as AccountTreeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  DataUsage as DataUsageIcon,
  Hail as HailIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';

/* Relative Imports */
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';

// ----------------------------------------------------------------------

/* Side bar tabs */
const SidebarConfig = [
  // {
  //   title: 'Manage Roles',
  //   href: PAGE_COMPANY_DASHBOARD.roles.absolutePath,
  //   icon: SettingsIcon
  // },
  {
    title: 'Manage Designations',
    href: PAGE_COMPANY_DASHBOARD.designations.absolutePath,
    icon: AdminPanelSettingsIcon
  },
  {
    title: 'Manage Clients',
    href: PAGE_COMPANY_DASHBOARD.clients.absolutePath,
    icon: HailIcon
  },
  {
    title: 'Manage Projects',
    href: PAGE_COMPANY_DASHBOARD.projects.absolutePath,
    icon: AccountTreeIcon
  },
  {
    title: 'Manage Users',
    href: PAGE_COMPANY_DASHBOARD.users.absolutePath,
    icon: PersonIcon
  },
  // {
  //   title: 'Manage Tracker',
  //   href: PAGE_COMPANY_DASHBOARD.trackers.absolutePath,
  //   icon: DataUsageIcon
  // },
  {
    title: 'Reporting',
    href: PAGE_COMPANY_DASHBOARD.reporting.absolutePath,
    icon: DataUsageIcon
  }
  // {
  //   title: 'Manage Tracker Details',
  //   href: PAGE_COMPANY_DASHBOARD.trackerDetails.absolutePath,
  //   icon: SettingsIcon
  // }
];

export const SidebarUserConfig = [
  {
    title: 'My Projects',
    href: PAGE_COMPANY_DASHBOARD.myProjects.absolutePath,
    icon: AccountTreeIcon
  },
  {
    title: 'My Tracker',
    href: PAGE_COMPANY_DASHBOARD.myTracker.absolutePath,
    icon: DataUsageIcon
  }
];

export const SidebarActivityConfig = [
  {
    title: 'My Projects',
    href: PAGE_COMPANY_DASHBOARD.myProjects.absolutePath,
    icon: AccountTreeIcon
  }
];

export const SidebarEmployeeConfig = [
  {
    title: 'Employee Tracker',
    href: PAGE_COMPANY_DASHBOARD.employeeTracker.absolutePath,
    icon: DataUsageIcon
  }
];

export default SidebarConfig;
