/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Switch component to override default Mui Switch's style.
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
 * Switch contains the styles to override default Mui Switch and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiSwitch
 */
export default function Switch(theme: any): any {
  const isLight = theme.palette.mode === 'light';

  /* Output */
  return {
    MuiSwitch: {
      defaultProps: {
        color: 'primary'
      },

      styleOverrides: {
        root: {
          padding: 0,
          width: 34,
          height: 20
        },
        thumb: {
          width: 14,
          height: 14,
          boxShadow: theme.customShadows.z1
        },
        track: {
          borderRadius: '14px',
          opacity: 1,
          backgroundColor: theme.palette.grey[500]
        },
        switchBase: {
          left: 4,
          top: 3,
          padding: 0,
          right: 'auto',
          '&.Mui-checked': {
            transform: 'translateX(13px)'
          },
          '&:not(:.Mui-checked)': {
            color: theme.palette.grey[isLight ? 100 : 300]
          },
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.grey[isLight ? 400 : 600]
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: theme.palette.action.disabledBackground
          }
        }
      }
    }
  };
}
