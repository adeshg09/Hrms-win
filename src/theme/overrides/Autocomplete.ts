/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Autocomplete component to override default Mui Autocomplete's style.
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

/**
 * Autocomplete contains the styles to override default Mui Autocomplete and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiAutocomplete
 */
export default function AutoComplete(theme: any): any {
  const isLight = theme.palette.mode === 'light';

  /* Output */
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: isLight
            ? theme.palette.background.default
            : theme.palette.background.paper,
          boxShadow: theme.customShadows.z24
        }
      }
    }
  };
}
