/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the settings hook.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 16/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { useCallback, useContext } from 'react';

/* Relative Imports */
import ThemeContext from 'context/ThemeContext';

// ----------------------------------------------------------------------

/**
 * Hook to get/set the theme mode
 * @component
 * @yields {function}
 */
export default function useSettings(): any {
  /* Hooks */
  const { themeMode, switchMode } = useContext(ThemeContext);

  /**
   * function to change the theme mode
   *
   * @returns {void}
   */
  const handleChangeTheme = useCallback(() => {
    switchMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [themeMode]);

  /* Output */
  return {
    themeMode,
    switchMode: handleChangeTheme
  };
}
