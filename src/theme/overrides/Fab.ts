/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Fab component to override default Mui Fab's style.
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
 * Fab contains the styles to override default Mui Fab and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiFab
 */
export default function Fab(theme: any): any {
  /* Output */
  return {
    MuiFab: {
      defaultProps: {
        color: 'primary'
      },

      variants: [
        {
          props: { color: 'primary' },
          style: {
            boxShadow: theme.customShadows.primary,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }
        }
      ],

      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.grey[400]
          }
        },
        primary: {},
        extended: {
          '& svg': {
            marginRight: theme.spacing(1)
          }
        }
      }
    }
  };
}
