/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the company routes.
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
import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/* Relative Imports */
import AdminDashboardLayout from 'layout/AdminDashboardLayout';

/* Local Imports */
import {
  PAGE_COMPANY_DASHBOARD,
  PAGE_SUBMODULE_COMPANY_DASHBOARD
} from './paths';
import AuthGuard from './guards/AuthGuard';

// ----------------------------------------------------------------------

/* Company Dashboard Module Imports */
const ManageRolePage = lazy(
  () => import('views/company-dashboard/dashboard/roles/ManageRole')
);

const CreateRolePage = lazy(
  () => import('views/company-dashboard/dashboard/roles/CreateRole')
);

const ManageDesignationPage = lazy(
  () =>
    import('views/company-dashboard/dashboard/designations/ManageDesignation')
);

const CreateDesignationPage = lazy(
  () =>
    import('views/company-dashboard/dashboard/designations/CreateDesignation')
);

const ManageEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/ManageEmployee')
);

const CreateEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/CreateEmployee')
);

const EditEmployeePage = lazy(
  () => import('views/company-dashboard/dashboard/employees/EditEmployee')
);

const ManageClientPage = lazy(
  () => import('views/company-dashboard/dashboard/clients/ManageClient')
);

const CreateClientPage = lazy(
  () => import('views/company-dashboard/dashboard/clients/CreateClient')
);

const ManageProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/projects/ManageProjects')
);

const CreateProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/projects/CreateProjects')
);

const ReportingModulePage = lazy(
  () => import('views/company-dashboard/dashboard/reporting-module')
);

const ManageMyProjectPage = lazy(
  () => import('views/company-dashboard/dashboard/my-projects/MyProjects')
);

const ManageMyTrackerPage = lazy(
  () => import('views/company-dashboard/dashboard/my-tracker')
);

const ManageMyProfilePage = lazy(
  () => import('views/company-dashboard/dashboard/my-profile/MyProfile')
);

const MyPersonalDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyPersonalDetails/MyPersonalDetails'
    )
);
const MyProfessionalDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyProfessionalDetails/MyProfessionalDetails'
    )
);
const MyAddressDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyAddressDetails/MyAddressDetails'
    )
);
const MyFamilyDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyFamilyDetails/MyFamilyDetails'
    )
);
const MyEducationDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyEducationDetails/MyEducationDetails'
    )
);
const MyEmergencyContactDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyEmergencyContactDetails/MyEmergencyContactDetails'
    )
);
const MyExperienceDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyExperiencDetails/MyExperienceDetails'
    )
);
const MyDocumentsDetailsPage = lazy(
  () =>
    import(
      'views/company-dashboard/dashboard/my-profile/MyDocumentDetails/MyDocumentDetails'
    )
);

const ManageDocuments = lazy(
  () =>
    import('views/company-dashboard/dashboard/document-types/ManageDocuments')
);

const CreateDocuments = lazy(
  () =>
    import('views/company-dashboard/dashboard/document-types/CreateDocument')
);

const ManageLeaveType = lazy(
  () => import('views/company-dashboard/dashboard/leave-types/ManageLeaveType')
);
const ManageEntitlements = lazy(
  () =>
    import('views/company-dashboard/dashboard/leave-request/ManageEntitlements')
);
const ManageLeaveRequest = lazy(
  () =>
    import('views/company-dashboard/dashboard/leave-request/ManageLeaveRequest')
);
const MyLeaves = lazy(
  () => import('views/company-dashboard/dashboard/my-leaves/MyLeaves')
);

// const ManageEmployeeTrackerPage = lazy(
//   () =>
//     import('views/company-dashboard/dashboard/employee-tracker/EmployeeTracker')
// );

const NotAllowedPage = lazy(() => import('views/page-not-allowed'));

// ----------------------------------------------------------------------

/* Functions */
/**
 * function to fetch routes
 * @param {string} primaryAccessRole - primary access role to get routes
 * @param {boolean} isProjectLeader - is project leader to get routes
 * @param {Array} companySubModules - company sub modules to get assigned sub modules
 * @param {Array} AllCompanySubModules - company sub modules to get all assigned sub modules
 * @returns {void}
 */
const getCompanyDashboardRoutes = (
  primaryAccessRole: string,
  isProjectLeader: boolean,
  companySubModules: string[],
  AllCompanySubModules: string[] | null
): Array<object> => {
  let dashboardRoutes: Array<object> = [
    {
      path: PAGE_COMPANY_DASHBOARD.root.relativePath,
      element: (
        <AuthGuard>
          <AdminDashboardLayout>
            <></>
          </AdminDashboardLayout>
        </AuthGuard>
      )
    }
  ];
  if (primaryAccessRole) {
    let rootRedirect = PAGE_COMPANY_DASHBOARD.myProfile.absolutePath; // change to profile route
    if (primaryAccessRole === 'admin') {
      rootRedirect = PAGE_COMPANY_DASHBOARD.roles.absolutePath;
    }
    // else if (primaryAccessRole === 'contentManager') {
    //   rootRedirect = PAGE_COMPANY_DASHBOARD.designations.absolutePath;
    // }

    dashboardRoutes = [
      {
        path: PAGE_COMPANY_DASHBOARD.root.relativePath,
        element: (
          <AuthGuard>
            <AdminDashboardLayout>
              <Outlet />
            </AdminDashboardLayout>
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={rootRedirect} />
          },
          {
            path: PAGE_COMPANY_DASHBOARD.roles.relativePath,
            children:
              primaryAccessRole === 'admin'
                ? [
                    {
                      index: true,
                      element: <ManageRolePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.roles.create.relativePath,
                      element: <CreateRolePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.roles.edit.relativePath,
                      element: <CreateRolePage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            // change to sub module condition
            path: PAGE_COMPANY_DASHBOARD.designations.relativePath,
            children: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.designations
            )
              ? [
                  {
                    index: true,
                    element: <ManageDesignationPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.designations.create
                      .relativePath,
                    element: <CreateDesignationPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.designations.edit.relativePath,
                    element: <CreateDesignationPage />
                  }
                ]
              : [
                  {
                    index: true,
                    element: <NotAllowedPage />
                  }
                ]
          },
          {
            // change to sub module condition ***************************************************************************
            path: PAGE_COMPANY_DASHBOARD.employees.relativePath,
            children:
              primaryAccessRole === 'admin' ||
              companySubModules?.includes(
                PAGE_SUBMODULE_COMPANY_DASHBOARD.designations
              )
                ? [
                    {
                      index: true,
                      element: <ManageEmployeePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.employees.create
                        .relativePath,
                      element: <CreateEmployeePage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.employees.edit.relativePath,
                      element: <EditEmployeePage />
                    }
                  ]
                : [
                    {
                      index: true,
                      element: <NotAllowedPage />
                    }
                  ]
          },
          {
            // change to sub module condition
            path: PAGE_COMPANY_DASHBOARD.clients.relativePath,
            children: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.clients
            )
              ? [
                  {
                    index: true,
                    element: <ManageClientPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.clients.create.relativePath,
                    element: <CreateClientPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.clients.edit.relativePath,
                    element: <CreateClientPage />
                  }
                ]
              : [
                  {
                    index: true,
                    element: <NotAllowedPage />
                  }
                ]
          },
          {
            // change to sub module condition
            path: PAGE_COMPANY_DASHBOARD.projects.relativePath,
            children: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.projects
            )
              ? [
                  {
                    index: true,
                    element: <ManageProjectPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.projects.create.relativePath,
                    element: <CreateProjectPage />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.projects.edit.relativePath,
                    element: <CreateProjectPage />
                  }
                ]
              : [
                  {
                    index: true,
                    element: <NotAllowedPage />
                  }
                ]
          },
          {
            // change to sub module condition
            path: PAGE_COMPANY_DASHBOARD.reporting.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.reporting
            ) ? (
              <ReportingModulePage />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.myTracker.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.myTracker
            ) ? (
              <ManageMyTrackerPage />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.myProjects.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.myProjects
            ) ? (
              <ManageMyProjectPage />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.leaveType.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.leaveType
            ) ? (
              <ManageLeaveType />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.entitlements.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.entitlements
            ) ? (
              <ManageEntitlements />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.leaveRequest.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.leaveRequest
            ) ? (
              <ManageLeaveRequest />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition-----also to add not allowed condition
            path: PAGE_COMPANY_DASHBOARD.myLeaves.relativePath,
            element: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.myLeaves
            ) ? (
              <MyLeaves />
            ) : (
              <NotAllowedPage />
            )
          },
          {
            // change to sub module condition
            path: PAGE_COMPANY_DASHBOARD.manageDocuments.relativePath,
            children: companySubModules?.includes(
              PAGE_SUBMODULE_COMPANY_DASHBOARD.manageDocuments
            )
              ? [
                  {
                    index: true,
                    element: <ManageDocuments />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.manageDocuments.create
                      .relativePath,
                    element: <CreateDocuments />
                  },
                  {
                    path: PAGE_COMPANY_DASHBOARD.manageDocuments.edit
                      .relativePath,
                    element: <CreateDocuments />
                  }
                ]
              : [
                  {
                    index: true,
                    element: <NotAllowedPage />
                  }
                ]
          },
          {
            path: PAGE_COMPANY_DASHBOARD.myProfile.relativePath,
            children:
              (primaryAccessRole !== 'admin' &&
                AllCompanySubModules?.includes(
                  PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
                )) ||
              (primaryAccessRole === 'admin' &&
                companySubModules?.includes(
                  PAGE_SUBMODULE_COMPANY_DASHBOARD.employees
                ))
                ? [
                    { index: true, element: <ManageMyProfilePage /> },
                    // {
                    //   path: PAGE_COMPANY_DASHBOARD.myProfile.professionalDetails
                    //     .relativePath,
                    //   element: <MyProfessionalDetailsPage />
                    // },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.personalDetails
                        .relativePath,
                      element: <MyPersonalDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.addressDetails
                        .relativePath,
                      element: <MyAddressDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.educationDetails
                        .relativePath,
                      element: <MyEducationDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.familyDetails
                        .relativePath,
                      element: <MyFamilyDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile
                        .emergencyContactDetails.relativePath,
                      element: <MyEmergencyContactDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.experienceDetails
                        .relativePath,
                      element: <MyExperienceDetailsPage />
                    },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.documentsDetails
                        .relativePath,
                      element: <MyDocumentsDetailsPage />
                    }
                  ]
                : [
                    { index: true, element: <ManageMyProfilePage /> },
                    {
                      path: PAGE_COMPANY_DASHBOARD.myProfile.professionalDetails
                        .relativePath,
                      element: <MyProfessionalDetailsPage />
                    }
                  ]
          }
          // {
          //   path: PAGE_COMPANY_DASHBOARD.employeeTracker.relativePath,
          //   element: isProjectLeader ? (
          //     <ManageEmployeeTrackerPage />
          //   ) : (
          //     <NotAllowedPage />
          //   )
          // }
        ]
      }
    ];
  }

  return dashboardRoutes;
};

export default getCompanyDashboardRoutes;
