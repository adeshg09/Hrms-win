/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create routing from all the routes.
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
import { Suspense, useContext } from 'react';
import { useRoutes } from 'react-router-dom';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import LoadingScreen from 'components/LoadingScreen';

/* Local Imports */
import RootRoutes, { NotFoundRoutes } from './rootRoutes';
import getMasterDashboardRoutes from './masterDashboardRoutes';
import getCompanyDashboardRoutes from './companyDashboardRoutes';

// ----------------------------------------------------------------------

/**
 * Create routing with the routes
 *
 * @return {JSX.Element}
 */
const Routing: React.FC = (): JSX.Element => {
  const { user, primaryAccessRole, companySubmodules } =
    useContext(SessionContext);
  let dashboardRoutes = [];
  if (user) {
    dashboardRoutes =
      user.company_id > 0
        ? getCompanyDashboardRoutes(
            primaryAccessRole || '',
            user.profile?.is_project_leader,
            user?.companySubModules,
            companySubmodules
          )
        : getMasterDashboardRoutes(primaryAccessRole || '');
  } else {
    dashboardRoutes = [
      ...getMasterDashboardRoutes(''),
      ...getCompanyDashboardRoutes('', false, [], [])
    ];
  }

  const routes = [...RootRoutes, ...dashboardRoutes, ...NotFoundRoutes];

  const content = useRoutes(routes);

  return <Suspense fallback={<LoadingScreen />}>{content}</Suspense>;
};

export default Routing;
