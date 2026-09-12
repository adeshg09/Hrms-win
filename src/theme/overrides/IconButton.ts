/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description IconButton component to override default Mui IconButton's style.
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
 * IconButton contains the styles to override default Mui IconButton and it's children's styles.
 *
 * @component
 * @returns Add-on styles for MuiIconButton
 */
export default function IconButton(): any {
  /* Output */
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0,
          '&:hover': {
            background: 'none'
          }
        }
      }
    }
  };
}
