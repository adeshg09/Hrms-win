/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Main app component to enter in project.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 14/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import feather from 'feather-icons';

/* Relative Imports */
import ThemeConfig from 'theme';
import Routing from 'routes';
import { SessionProvider } from 'context/SessionContext';
import { ThemeContextProvider } from 'context/ThemeContext';
import ScrollToTop from 'components/ScrollToTop';
import NotistackProvider from 'components/NotistackProvider';
import ThemeModeSetting from 'components/ThemeModeSetting';

// ----------------------------------------------------------------------

/**
 * App component to to set all the higher level components and routes.
 *
 * @component
 * @returns {JSX.Element}
 */
const App: React.FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <ThemeContextProvider>
        <ThemeConfig>
          <SessionProvider>
            <NotistackProvider>
              <ThemeModeSetting />
              <Router>
                <ScrollToTop />
                <Routing />
              </Router>
            </NotistackProvider>
          </SessionProvider>
        </ThemeConfig>
      </ThemeContextProvider>
    </HelmetProvider>
  );
};

export default App;
