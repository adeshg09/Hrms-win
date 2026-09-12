/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Drawer component to override default Mui Drawer's style.
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
import { alpha, Theme } from '@mui/material';

// ----------------------------------------------------------------------

/**
 * Drawer contains the styles to override default Mui Drawer and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiDrawer
 */
export default function Drawer(theme: Theme): any {
  const isLight = theme.palette.mode === 'light';

  /* Output */

  return {
    MuiDrawer: {
      styleOverrides: {
        paperAnchorLeft: {
          width: 264
        },
        modal: {
          '&[role="presentation"]': {
            '& .MuiDrawer-paperAnchorLeft': {
              boxShadow: `8px 24px 24px 12px ${alpha(
                theme.palette.grey[900],
                isLight ? 0.16 : 0.48
              )}`
            },
            '& .MuiDrawer-paperAnchorRight': {
              boxShadow: `-8px 24px 24px 12px ${alpha(
                theme.palette.grey[900],
                isLight ? 0.16 : 0.48
              )}`
            }
          }
        }
      }
    }
  };
}
