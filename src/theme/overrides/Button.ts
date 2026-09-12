/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Button component to override default Mui Button's style.
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
 * Button contains the styles to override default Mui Button and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiButton
 */
export default function Button(theme: any): any {
  /* Output */
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: theme.shape.borderRadiusXs,
          textTransform: 'none',
          textAlign: 'center',
          padding: theme.spacing(1, 2),
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5)
          },
          '&:hover': {
            boxShadow: 'none'
          }
        },
        containedSizeLarge: {
          height: 48
        },
        containedSizeMedium: {
          height: 40
        },
        containedSizeSmall: {
          height: 32
        },
        outlinedSizeLarge: {
          height: 48
        },
        outlinedSizeMedium: {
          height: 40
        },
        outlinedSizeSmall: {
          height: 32
        },
        containedInherit: {
          color: theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.grey[400]
          }
        },
        outlinedInherit: {
          border: `1px solid ${theme.palette.grey[50032]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        },
        text: {
          padding: 0,
          [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0
          },
          '&:hover': {
            background: 'none'
          }
        }
      }
    }
  };
}
