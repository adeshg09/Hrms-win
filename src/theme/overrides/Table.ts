/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Table component to override default Mui Table's style.
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
 * Table contains the styles to override default Mui Table and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiTable
 */
export default function Table(theme: any): any {
  const isLight = theme.palette.mode === 'light';

  /* Output */
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadiusXs
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even) > td.MuiTableCell-root ': {
            backgroundColor: alpha(
              theme.palette.grey[isLight ? 300 : 600],
              0.24
            )
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        },
        head: {
          padding: theme.spacing(1.5, 2),
          backgroundColor: theme.palette.grey[isLight ? 300 : 600],
          '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadiusXs,
            borderBottomLeftRadius: theme.shape.borderRadiusXs
          },
          '&:last-of-type': {
            borderTopRightRadius: theme.shape.borderRadiusXs,
            borderBottomRightRadius: theme.shape.borderRadiusXs
          },
          '&:not(:last-of-type)': {
            borderRight: `1px solid ${
              isLight ? theme.palette.common.white : theme.palette.grey[800]
            }`
          }
        },
        footer: {
          padding: theme.spacing(1.5, 2)
        }
      }
    }
  };
}
