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
  Business as BusinessIcon,
  LocalOffer as LocalOfferIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Percent as PercentIcon,
  Person as PersonIcon,
  Timelapse as TimelapseIcon,
  ViewModule as ViewModuleIcon,
  Schema as SubModuleIcon,
  AccountTree as AccountTreeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  DataUsage as DataUsageIcon,
  Hail as HailIcon,
  AccountBox as ProfileIcon,
  ContactMail as PersonalDetailsIcon,
  Work as ProfessionalDetailsIcon,
  Home as AddressDetailsIcon,
  People as FamilyDetailsIcon,
  School as EducationDetailsIcon,
  ContactPhone as EmergencyContactIcon,
  WorkHistory as ExperienceDetailsIcon,
  Folder as DocumentsDetailsIcon,
  ArticleOutlined as DocumentIcon,
  EventNote as LeaveRequest,
  PostAdd as ApplyLeave,
  Tune as LeaveType
} from '@mui/icons-material';

/* Relative Imports */
import {
  PAGE_ADMIN_DASHBOARD,
  PAGE_COMPANY_DASHBOARD,
  PAGE_SUBMODULE_COMPANY_DASHBOARD
} from 'routes/paths';

// ----------------------------------------------------------------------

/* Side bar tabs */
const masterSidebarConfig = [
  {
    title: 'Manage Roles',
    href: PAGE_ADMIN_DASHBOARD.roles.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Users',
    href: PAGE_ADMIN_DASHBOARD.users.absolutePath,
    icon: PersonIcon
  },
  // {
  //   title: 'Manage Modules',
  //   href: PAGE_ADMIN_DASHBOARD.modules.absolutePath,
  //   icon: ViewModuleIcon
  // },
  {
    title: 'Manage Company Modules',
    href: PAGE_ADMIN_DASHBOARD.companyModules.absolutePath,
    icon: ViewModuleIcon
  },
  {
    title: 'Manage Company Sub Modules',
    href: PAGE_ADMIN_DASHBOARD.companySubModules.absolutePath,
    icon: SubModuleIcon
  },
  {
    title: 'Manage Plan Durations',
    href: PAGE_ADMIN_DASHBOARD.planDuration.absolutePath,
    icon: TimelapseIcon
  },
  {
    title: 'Manage Plans',
    href: PAGE_ADMIN_DASHBOARD.plans.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Plan Prices',
    href: PAGE_ADMIN_DASHBOARD.planPrice.absolutePath,
    icon: SettingsIcon
  },
  {
    title: 'Manage Coupon Codes',
    href: PAGE_ADMIN_DASHBOARD.couponCodes.absolutePath,
    icon: PercentIcon
  },
  {
    title: 'Manage Companies',
    href: PAGE_ADMIN_DASHBOARD.companies.absolutePath,
    icon: BusinessIcon
  },
  {
    title: 'Manage Orders',
    href: PAGE_ADMIN_DASHBOARD.orders.absolutePath,
    icon: InventoryIcon
  }
];

export const masterContentManagerSidebarConfig = [
  // {
  //   title: 'Manage Modules',
  //   href: PAGE_ADMIN_DASHBOARD.modules.absolutePath,
  //   icon: ViewModuleIcon
  // },
  {
    title: 'Manage Plan Durations',
    href: PAGE_ADMIN_DASHBOARD.planDuration.absolutePath,
    icon: TimelapseIcon
  },
  {
    title: 'Manage Plans',
    href: PAGE_ADMIN_DASHBOARD.plans.absolutePath,
    icon: LocalPostOfficeIcon
  },
  {
    title: 'Manage Plan Prices',
    href: PAGE_ADMIN_DASHBOARD.planPrice.absolutePath,
    icon: LocalOfferIcon
  },
  {
    title: 'Manage Coupon Codes',
    href: PAGE_ADMIN_DASHBOARD.couponCodes.absolutePath,
    icon: PercentIcon
  }
];

export const companySidebarConfig = [
  {
    title: 'Manage Roles',
    href: PAGE_COMPANY_DASHBOARD.roles.absolutePath,
    icon: SettingsIcon
  },
  // {
  //   title: 'Manage Designations',
  //   href: PAGE_COMPANY_DASHBOARD.designations.absolutePath,
  //   icon: AdminPanelSettingsIcon
  // },
  // {
  //   title: 'Manage Users',
  //   href: PAGE_COMPANY_DASHBOARD.users.absolutePath,
  //   icon: PersonIcon
  // },
  {
    title: 'Manage Employees',
    href: PAGE_COMPANY_DASHBOARD.employees.absolutePath,
    icon: PersonIcon
  }
  // {
  //   title: 'Manage Document Type',
  //   href: PAGE_COMPANY_DASHBOARD.manageDocuments.absolutePath,
  //   icon: DocumentIcon
  // },
  // {
  //   title: 'Manage Clients',
  //   href: PAGE_COMPANY_DASHBOARD.clients.absolutePath,
  //   icon: HailIcon
  // },
  // {
  //   title: 'Manage Projects',
  //   href: PAGE_COMPANY_DASHBOARD.projects.absolutePath,
  //   icon: AccountTreeIcon
  // },
  // {
  //   title: 'Reporting',
  //   href: PAGE_COMPANY_DASHBOARD.reporting.absolutePath,
  //   icon: DataUsageIcon
  // },
  // {
  //   title: 'Manage Leave Type',
  //   href: PAGE_COMPANY_DASHBOARD.leaveType.absolutePath,
  //   icon: DocumentIcon
  // },
  // {
  //   title: 'Manage Leave Request',
  //   href: PAGE_COMPANY_DASHBOARD.leaveRequest.absolutePath,
  //   icon: DocumentIcon
  // },
];

export const companyContentManagerSidebarConfig = [
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
  }
];

export const companyUserSidebarConfig = [
  {
    title: 'My Profile',
    href: PAGE_COMPANY_DASHBOARD.myProfile.absolutePath,
    icon: ProfileIcon,
    subItems: [
      {
        title: 'Personal Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/personal-details`,
        icon: PersonalDetailsIcon
      },
      {
        title: 'Professional Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/professional-details`,
        icon: ProfessionalDetailsIcon
      },
      {
        title: 'Address Details',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/address-details`,
        icon: AddressDetailsIcon
      },
      {
        title: 'Family',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/family-details`,
        icon: FamilyDetailsIcon
      },
      {
        title: 'Education ',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/education-details`,
        icon: EducationDetailsIcon
      },
      {
        title: 'Emergency Contact ',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/emergency-contact-details`,
        icon: EmergencyContactIcon
      },
      {
        title: 'Experience ',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/experience-details`,
        icon: ExperienceDetailsIcon
      },
      {
        title: 'Documents ',
        href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/documents-details`,
        icon: DocumentsDetailsIcon
      }
    ]
  },
  {
    title: 'Apply Leave ',
    href: PAGE_COMPANY_DASHBOARD.myLeaves.absolutePath,
    icon: DocumentIcon
  },
  {
    title: 'My Tracker',
    href: PAGE_COMPANY_DASHBOARD.myTracker.absolutePath,
    icon: DataUsageIcon
  },
  {
    title: 'My Projects',
    href: PAGE_COMPANY_DASHBOARD.myProjects.absolutePath,
    icon: AccountTreeIcon
  }
];

export const companyProjectLeaderSidebarConfig = [
  {
    title: 'Employee Tracker',
    href: PAGE_COMPANY_DASHBOARD.employeeTracker.absolutePath,
    icon: DataUsageIcon
  }
];

export const GetSidebarItemsBasedOnSubModules = (
  companySubModules: string[] | null,
  primaryAccessRole: string | null,
  AllCompanySubModules: string[] | null
): any => {
  console.log('all sub modules are', AllCompanySubModules);
  const sidebarItems: any = [
    {
      title: 'My Profile',
      href: PAGE_COMPANY_DASHBOARD.myProfile.absolutePath,
      icon: ProfileIcon,
      subItems: [
        // {
        //   title: 'Professional Details',
        //   href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/professional-details`,
        //   icon: ProfessionalDetailsIcon
        // },
        ...((primaryAccessRole !== 'admin' &&
          AllCompanySubModules?.includes(
            PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
          )) ||
        (primaryAccessRole === 'admin' &&
          companySubModules?.includes(
            PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
          ))
          ? [
              {
                title: 'Personal Details',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/personal-details`,
                icon: PersonalDetailsIcon
              },
              {
                title: 'Address Details',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/address-details`,
                icon: AddressDetailsIcon
              },
              {
                title: 'Family',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/family-details`,
                icon: FamilyDetailsIcon
              },
              {
                title: 'Education ',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/education-details`,
                icon: EducationDetailsIcon
              },
              {
                title: 'Emergency Contact ',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/emergency-contact-details`,
                icon: EmergencyContactIcon
              },
              {
                title: 'Experience ',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/experience-details`,
                icon: ExperienceDetailsIcon
              },
              {
                title: 'Documents ',
                href: `${PAGE_COMPANY_DASHBOARD.myProfile.absolutePath}/documents-details`,
                icon: DocumentsDetailsIcon
              }
            ]
          : [])
      ]
    }
  ];

  if (
    primaryAccessRole !== 'admin' &&
    companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.employees)
  ) {
    sidebarItems.push({
      title: 'Manage Employees',
      href: PAGE_COMPANY_DASHBOARD.employees.absolutePath,
      icon: PersonIcon
    });
  }

  if (
    companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.designations)
  ) {
    sidebarItems.push({
      title: 'Manage Designations',
      href: PAGE_COMPANY_DASHBOARD.designations.absolutePath,
      icon: AdminPanelSettingsIcon
    });
  }
  if (
    companySubModules?.includes(
      PAGE_SUBMODULE_COMPANY_DASHBOARD.manageDocuments
    )
  ) {
    sidebarItems.push({
      title: 'Manage Document Type',
      href: PAGE_COMPANY_DASHBOARD.manageDocuments.absolutePath,
      icon: DocumentIcon
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.clients)) {
    sidebarItems.push({
      title: 'Manage Clients',
      href: PAGE_COMPANY_DASHBOARD.clients.absolutePath,
      icon: HailIcon
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.projects)) {
    sidebarItems.push({
      title: 'Manage Projects',
      href: PAGE_COMPANY_DASHBOARD.projects.absolutePath,
      icon: AccountTreeIcon
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.reporting)) {
    sidebarItems.push({
      title: 'Reporting',
      href: PAGE_COMPANY_DASHBOARD.reporting.absolutePath,
      icon: DataUsageIcon
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.myTracker)) {
    sidebarItems.push({
      title: 'My Tracker',
      href: PAGE_COMPANY_DASHBOARD.myTracker.absolutePath,
      icon: DataUsageIcon
    });
  }
  if (
    companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.myProjects)
  ) {
    sidebarItems.push({
      title: 'My Projects',
      href: PAGE_COMPANY_DASHBOARD.myProjects.absolutePath,
      icon: AccountTreeIcon
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.leaveType)) {
    sidebarItems.push({
      title: 'Manage Leave Type',
      href: PAGE_COMPANY_DASHBOARD.leaveType.absolutePath,
      icon: LeaveType
    });
  }
  if (
    companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.leaveRequest)
  ) {
    sidebarItems.push({
      title: 'Manage Leave Request',
      href: PAGE_COMPANY_DASHBOARD.leaveRequest.absolutePath,
      icon: LeaveRequest
    });
  }
  if (companySubModules?.includes(PAGE_SUBMODULE_COMPANY_DASHBOARD.myLeaves)) {
    sidebarItems.push({
      title: 'My Leaves',
      href: PAGE_COMPANY_DASHBOARD.myLeaves.absolutePath,
      icon: ApplyLeave
    });
  }

  return sidebarItems;
};

export default masterSidebarConfig;
