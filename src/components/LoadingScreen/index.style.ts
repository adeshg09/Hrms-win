/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for loading screen component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { alpha } from '@mui/material';

export default {
  rootStyle: (theme: any) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
    zIndex: 1
  }),
  logo: {
    width: 64,
    height: 64
  },
  outerBox: (theme: any) => ({
    width: 120,
    height: 120,
    borderRadius: '25%',
    position: 'absolute',
    border: `8px solid ${alpha(theme.palette.primary.dark, 0.24)}`
  }),
  innerBox: (theme: any) => ({
    width: 100,
    height: 100,
    borderRadius: '25%',
    position: 'absolute',
    border: `3px solid ${alpha(theme.palette.primary.dark, 0.24)}`
  })
};
