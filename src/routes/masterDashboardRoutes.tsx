/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the root routes.
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
import { PAGE_ADMIN_DASHBOARD } from './paths';
import AuthGuard from './guards/AuthGuard';

// ----------------------------------------------------------------------

/* Admin Dashboard Module Imports */
const ManageRolePage = lazy(
  () => import('views/master-dashboard/dashboard/roles/ManageRole')
);

const ManageUserPage = lazy(
  () => import('views/master-dashboard/dashboard/users/ManageUser')
);

const CreateUserPage = lazy(
  () => import('views/master-dashboard/dashboard/users/CreateUser')
);

const ManageModulePage = lazy(
  () => import('views/master-dashboard/dashboard/modules/ManageModule')
);

const CreateModulePage = lazy(
  () => import('views/master-dashboard/dashboard/modules/CreateModule')
);

const ManageCompanyModulePage = lazy(
  () =>
    import(
      'views/master-dashboard/dashboard/company-modules/ManageCompanyModule'
    )
);

const CreateCompanyModulePage = lazy(
  () =>
    import(
      'views/master-dashboard/dashboard/company-modules/CreateCompanyModule'
    )
);

const ManageCompanySubModulePage = lazy(
  () =>
    import(
      'views/master-dashboard/dashboard/company-sub-modules/ManageCompanySubModule'
    )
);

const CreateCompanySubModulePage = lazy(
  () =>
    import(
      'views/master-dashboard/dashboard/company-sub-modules/CreateCompanySubModule'
    )
);

const ManageCouponCodePage = lazy(
  () => import('views/master-dashboard/dashboard/coupon-codes/ManageCouponCode')
);

const CreateCouponCodePage = lazy(
  () => import('views/master-dashboard/dashboard/coupon-codes/CreateCouponCode')
);

const ManagePlanDuration = lazy(
  () =>
    import('views/master-dashboard/dashboard/plan-durations/ManagePlanDuration')
);

const CreatePlanDuration = lazy(
  () =>
    import('views/master-dashboard/dashboard/plan-durations/CreatePlanDuration')
);

const ManagePlan = lazy(
  () => import('views/master-dashboard/dashboard/plans/ManagePlan')
);

const CreatePlan = lazy(
  () => import('views/master-dashboard/dashboard/plans/CreatePlan')
);

const ManagePlanPrice = lazy(
  () => import('views/master-dashboard/dashboard/plan-price/ManagePlanPrice')
);

const CreatePlanPrice = lazy(
  () => import('views/master-dashboard/dashboard/plan-price/CreatePlanPrice')
);

const ManageCompanyPage = lazy(
  () => import('views/master-dashboard/dashboard/companies/ManageCompany')
);

const CreateCompanyPage = lazy(
  () => import('views/master-dashboard/dashboard/companies/CreateCompany')
);

const EditCompanyPage = lazy(
  () => import('views/master-dashboard/dashboard/companies/EditCompany')
);

const ManageOrderPage = lazy(
  () => import('views/master-dashboard/dashboard/orders/ManageOrder')
);

const NotAllowedPage = lazy(() => import('views/page-not-allowed'));

// ----------------------------------------------------------------------

/* Functions */
/**
 * function to fetch routes
 * @param {string} primaryAccessRole - primary access role to get routes
 * @returns {void}
 */
const getMasterDashboardRoutes = (primaryAccessRole: string): Array<object> => {
  let dashboardRoutes: Array<object> = [
    {
      path: PAGE_ADMIN_DASHBOARD.root.relativePath,
      element: (
        <AuthGuard>
          <AdminDashboardLayout>
            <></>
          </AdminDashboardLayout>
        </AuthGuard>
      )
    }
  ];

  if (
    primaryAccessRole &&
    (primaryAccessRole === 'admin' || primaryAccessRole === 'contentManager')
  ) {
    dashboardRoutes = [
      {
        path: PAGE_ADMIN_DASHBOARD.root.relativePath,
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
            element: (
              <Navigate
                to={
                  primaryAccessRole === 'admin'
                    ? PAGE_ADMIN_DASHBOARD.roles.absolutePath
                    : PAGE_ADMIN_DASHBOARD.modules.absolutePath
                }
              />
            )
          },
          {
            path: PAGE_ADMIN_DASHBOARD.roles.relativePath,
            element:
              primaryAccessRole === 'admin' ? (
                <ManageRolePage />
              ) : (
                <NotAllowedPage />
              )
          },
          {
            path: PAGE_ADMIN_DASHBOARD.users.relativePath,
            children:
              primaryAccessRole === 'admin'
                ? [
                    {
                      index: true,
                      element: <ManageUserPage />
                    },
                    {
                      path: PAGE_ADMIN_DASHBOARD.users.create.relativePath,
                      element: <CreateUserPage />
                    },
                    {
                      path: PAGE_ADMIN_DASHBOARD.users.edit.relativePath,
                      element: <CreateUserPage />
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
            path: PAGE_ADMIN_DASHBOARD.modules.relativePath,
            children: [
              {
                index: true,
                element: <ManageModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.modules.create.relativePath,
                element: <CreateModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.modules.edit.relativePath,
                element: <CreateModulePage />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.companyModules.relativepath,
            children: [
              {
                index: true,
                element: <ManageCompanyModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.companyModules.create.relativePath,
                element: <CreateCompanyModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.companyModules.edit.relativePath,
                element: <CreateCompanyModulePage />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.companySubModules.relativepath,
            children: [
              {
                index: true,
                element: <ManageCompanySubModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.companySubModules.create
                  .relativePath,
                element: <CreateCompanySubModulePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.companySubModules.edit.relativePath,
                element: <CreateCompanySubModulePage />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.planDuration.relativePath,
            children: [
              {
                index: true,
                element: <ManagePlanDuration />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.planDuration.create.relativePath,
                element: <CreatePlanDuration />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.planDuration.edit.relativePath,
                element: <CreatePlanDuration />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.plans.relativePath,
            children: [
              {
                index: true,
                element: <ManagePlan />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.plans.create.relativePath,
                element: <CreatePlan />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.plans.edit.relativePath,
                element: <CreatePlan />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.planPrice.relativePath,
            children: [
              {
                index: true,
                element: <ManagePlanPrice />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.planPrice.create.relativePath,
                element: <CreatePlanPrice />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.planPrice.edit.relativePath,
                element: <CreatePlanPrice />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.couponCodes.relativePath,
            children: [
              {
                index: true,
                element: <ManageCouponCodePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.couponCodes.create.relativePath,
                element: <CreateCouponCodePage />
              },
              {
                path: PAGE_ADMIN_DASHBOARD.couponCodes.edit.relativePath,
                element: <CreateCouponCodePage />
              }
            ]
          },
          {
            path: PAGE_ADMIN_DASHBOARD.companies.relativePath,
            children:
              primaryAccessRole === 'admin'
                ? [
                    {
                      index: true,
                      element: <ManageCompanyPage />
                    },
                    {
                      path: PAGE_ADMIN_DASHBOARD.companies.create.relativePath,
                      element: <CreateCompanyPage />
                    },
                    {
                      path: PAGE_ADMIN_DASHBOARD.companies.edit.relativePath,
                      element: <EditCompanyPage />
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
            path: PAGE_ADMIN_DASHBOARD.orders.relativePath,
            element:
              primaryAccessRole === 'admin' ? (
                <ManageOrderPage />
              ) : (
                <NotAllowedPage />
              )
          }
        ]
      }
    ];
  }
  return dashboardRoutes;
};

export default getMasterDashboardRoutes;
