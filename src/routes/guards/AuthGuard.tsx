/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create auth guard.
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
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import SessionContext from 'context/SessionContext';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create component to define protectation layout for pages, which are not accessible without login.
 *
 * @interface AuthGuardProps
 * @property {node} children - contains the child components.
 */
export interface AuthGuardProps {
  children: React.ReactElement;
}

// ----------------------------------------------------------------------

/**
 * Component to define protectation layout for pages, which are not accessible without login
 *
 * @component
 * @param {node} children - contains the child components
 * @returns {JSX.Element}
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }): JSX.Element => {
  /* Hooks */
  const context = useContext(SessionContext);
  const location = useLocation();

  /* Output */
  if (!context.isAuthenticated) {
    return (
      <Navigate
        to={`${PAGE_ROOT.signIn.absolutePath}?returnurl=${location.pathname}`}
      />
    );
  }

  return children;
};

export default AuthGuard;
