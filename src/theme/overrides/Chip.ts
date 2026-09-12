/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Chip component to override default Mui Chip's style.
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
import CancelIcon from '@mui/icons-material/Cancel';
import { pxToRem } from 'utility/formatFontSize';

// ----------------------------------------------------------------------

/**
 * Chip contains the styles to override default Mui Chip and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiChip
 */
export default function Chip(theme: any): any {
  /* Output */
  return {
    MuiChip: {
      defaultProps: {
        deleteIcon: () => CancelIcon
      },

      styleOverrides: {
        root: {
          borderRadius: 2
        },
        icon: {
          fontSize: pxToRem(14)
        },
        colorDefault: {
          '& .MuiChip-avatarMedium, .MuiChip-avatarSmall': {
            color: theme.palette.text.secondary
          }
        },
        outlined: {
          borderColor: theme.palette.grey[50032],
          '&.MuiChip-colorPrimary': {
            borderColor: theme.palette.primary.main
          }
        }
      }
    }
  };
}
