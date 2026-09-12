/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for account pages/components.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 23/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/**
 * Style object for account pages/components
 *
 * @returns {object}
 */
export default {
  tabList: (theme: any) => ({
    // width: '100%',
    // mb: 10,
    // '& .MuiTabs-scroller': {
    //   display: 'flex',
    //   justifyContent: 'center'
    // },
    backgroundColor: theme.palette.divider,
    '& .MuiTab-root': {
      color: theme.palette.grey[500],
      py: 1
    }
    // [theme.breakpoints.down('md')]: {
    //   mb: 5
    // },
    // [theme.breakpoints.down(530)]: {
    //   '& .MuiTabs-flexContainer': {
    //     width: '-webkit-fill-available'
    //   }
    // }
  }),
  tabPanel: (theme: any) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(73, 71, 78, 0.24)' : undefined,
    p: 3,
    [theme.breakpoints.down('sm')]: {
      p: 1
    }
  })
};
