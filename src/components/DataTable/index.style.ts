/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for data table component.
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

export default {
  rootStyle: (theme: any) => ({
    boxShadow: theme.customShadows.z8,
    borderRadius: `${theme.shape.borderRadiusXs}px`
  }),
  headerNameStyle: {
    display: 'inline-flex',
    flexDirection: 'row'
  },
  tableContainer: {
    minWidth: 920
  },
  pagination: (theme: any) => ({
    position: 'static',
    borderTop: `1px solid ${theme.palette.divider}`
  }),
  loaderStyle: {
    height: 300
  }
};
