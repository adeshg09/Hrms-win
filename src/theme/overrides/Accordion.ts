/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Accordion component to override default Mui Accordion's style.
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
 * Accordion contains the styles to override default Mui Accordion and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiAccordion
 */
export default function Accordion(theme: Theme): any {
  /* Output */
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          marginTop: theme.spacing(3),
          '&.Mui-expanded': {
            border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`
          },
          '&:before': {
            height: 0
          },
          '&:last-of-type': {
            borderRadius: 0
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.background.default
              : theme.palette.background.paper,

          '&.Mui-expanded': {
            minHeight: 48
          }
        },
        content: {
          '&.Mui-expanded': {
            margin: theme.spacing(1.5, 0)
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 2)
        }
      }
    }
  };
}
