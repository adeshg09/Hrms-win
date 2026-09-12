/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Avatar component to override default Mui Avatar's style.
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
import { Theme } from '@mui/material';

// ----------------------------------------------------------------------

/**
 * Avatar contains the styles to override default Mui Avatar and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiAvatar & MuiAvatarGroup
 */
export default function Avatar(theme: Theme): any {
  /* Output */
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          ...theme.typography.h5,
          textDecoration: 'none'
        },
        colorDefault: {
          color: theme.palette.grey[600],
          backgroundColor: theme.palette.grey[300]
        }
      }
    }
  };
}
