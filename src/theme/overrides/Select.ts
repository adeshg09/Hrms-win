/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Select component to override default Mui Select's style.
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
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

// ----------------------------------------------------------------------

/**
 * Select contains the styles to override default Mui Select and it's children's styles.
 *
 * @component
 * @returns Add-on styles for MuiSelect
 */
export default function Select(): any {
  /* Output */
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreRoundedIcon
      },
      styleOverrides: {
        select: {
          height: 48,
          '&.MuiInputBase-inputSizeSmall': {
            height: 40
          }
        }
      }
    }
  };
}
