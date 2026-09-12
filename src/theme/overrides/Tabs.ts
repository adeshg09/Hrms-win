/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Tabs component to override default Mui Tabs's style.
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
 * Tabs contains the styles to override default Mui Tabs and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiTabs
 */
export default function Tabs(theme: Theme): any {
  /* Output */
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 0,
          fontWeight: theme.typography.fontWeightMedium,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          '&.Mui-selected': {
            color: theme.palette.text.primary
          },
          '&:not(:last-child)': {
            marginRight: theme.spacing(5)
          },
          '@media (min-width: 600px)': {
            minWidth: 48
          }
        },
        labelIcon: {
          minHeight: 48,
          paddingTop: 0,
          '& > .MuiTab-wrapper > *:first-of-type': {
            marginBottom: 0,
            marginRight: theme.spacing(1)
          }
        },
        wrapper: {
          flexDirection: 'row',
          whiteSpace: 'nowrap'
        },
        textColorInherit: {
          opacity: 1,
          color: theme.palette.text.secondary
        }
      }
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          width: 48,
          borderRadius: '50%'
        }
      }
    }
  };
}
