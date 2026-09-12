/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description ControlLabel component to override default Mui ControlLabel's style.
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
 * ControlLabel contains the styles to override default Mui ControlLabel and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiControlLabel
 */
export default function ControlLabel(theme: Theme): any {
  /* Output */
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1)
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          color: theme.palette.text.primary,
          '&.Mui-disabled': {
            color: theme.palette.action.disabled
          }
        },
        asterisk: {
          color: theme.palette.error.main
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transform: 'translate(14px, 13.5px) scale(1)'
        },
        sizeSmall: {
          transform: 'translate(14px, 9.5px) scale(1)'
        },
        shrink: {
          transform: 'translate(14px, -9px) scale(0.75)'
        },
        standard: {
          transform: 'translate(1px, 30px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(1px, -0.5px) scale(0.75)'
          }
        }
      }
    }
  };
}
