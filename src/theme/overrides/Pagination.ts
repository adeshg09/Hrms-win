/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Pagination component to override default Mui Pagination's style.
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
import { alpha } from '@mui/material';

// ----------------------------------------------------------------------

/**
 * Pagination contains the styles to override default Mui Pagination and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiPagination
 */
export default function Pagination(theme: any): any {
  /* Output */
  return {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadiusXs,
          '&.Mui-selected': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        textPrimary: {
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            '&:hover, &.Mui-focusVisible': {
              backgroundColor: `${alpha(
                theme.palette.primary.main,
                0.24
              )} !important`
            }
          }
        },
        outlined: {
          border: `1px solid ${theme.palette.divider}`
        },
        outlinedPrimary: {
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`
          }
        }
      }
    }
  };
}
