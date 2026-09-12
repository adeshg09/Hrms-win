/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for admin dashboard page component.
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
    minHeight: '100%',
    display: 'flex',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }),
  container: (theme: any) => ({
    boxShadow: theme.customShadows.z1,
    width: '100%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.paper
  }),
  cardContent: {
    padding: '0px !important'
  }
};
