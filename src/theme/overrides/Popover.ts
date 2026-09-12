/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Popover component to override default Mui Popover's style.
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
 * Popover contains the styles to override default Mui Popover and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiPopover
 */
export default function Popover(theme: any): any {
  const isLight = theme.palette.mode === 'light';

  /* Output */
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: isLight
            ? theme.palette.background.default
            : theme.palette.background.paper,
          boxShadow: theme.customShadows.z12,
          borderRadius: theme.shape.borderRadiusXs
        }
      }
    }
  };
}
