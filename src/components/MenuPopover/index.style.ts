/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for menu popover component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 18/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { alpha } from '@mui/material';

export default {
  popover: (theme: any) => ({
    mt: 1.5,
    ml: 0.5,
    overflow: 'inherit',
    boxShadow: theme.customShadows.z20,
    border: `1px solid ${theme.palette.grey[5008]}`,
    borderRadius: `${theme.shape.borderRadiusXs}px`,
    width: 200
  }),
  arrowStyle: (theme: any) => ({
    content: "''",
    top: -7,
    right: 15,
    zIndex: 1,
    width: 12,
    height: 12,
    position: 'absolute',
    borderRadius: '0 0 2px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`
  })
};
