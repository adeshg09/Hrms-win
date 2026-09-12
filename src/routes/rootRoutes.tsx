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

/* Relative Imports */
import AuthLayout from 'layout/AuthLayout';
import AdminDashboardLayout from 'layout/AdminDashboardLayout';

/* Local Imports */
import { PAGE_ROOT, ROOT_PATH } from './paths';
import UserGuard from './guards/UserGuard';
import AuthGuard from './guards/AuthGuard';

// ----------------------------------------------------------------------

/* Auth Module Imports */
const SignInPage = lazy(() => import('views/auth/SignIn'));

const ForgotPasswordPage = lazy(() => import('views/auth/ForgotPassword'));

const ResetPasswordPage = lazy(() => import('views/auth/ResetPassword'));

const MasterAccountPage = lazy(
  () => import('views/master-dashboard/my-account')
);

const NotFoundPage = lazy(() => import('views/page-not-found'));

// ----------------------------------------------------------------------

/**
 * assign components to routes
 *
 * @return {array}
 */
const RootRoutes: Array<object> = [
  {
    path: ROOT_PATH,
    element: (
      <UserGuard>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </UserGuard>
    )
  },
  {
    path: PAGE_ROOT.signIn.relativePath,
    element: (
      <UserGuard>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </UserGuard>
    )
  },
  {
    path: PAGE_ROOT.forgotPassword.relativePath,
    element: (
      <UserGuard>
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      </UserGuard>
    )
  },
  {
    path: PAGE_ROOT.resetPassword.relativePath,
    element: (
      <UserGuard>
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      </UserGuard>
    )
  },
  {
    path: PAGE_ROOT.account.relativePath,
    element: (
      <AuthGuard>
        <AdminDashboardLayout>
          <MasterAccountPage />
        </AdminDashboardLayout>
      </AuthGuard>
    )
  }
];

/**
 * assign component to no found routes
 *
 * @return {array}
 */
export const NotFoundRoutes: Array<object> = [
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default RootRoutes;
