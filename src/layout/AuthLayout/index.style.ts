/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for auth layout.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

export default {
  wrapperStyle: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative'
  },
  mainStyle: (theme: any) => ({
    flex: 1,
    display: 'flex',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down(900)]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 3)
    }
  }),
  logoStyle: (theme: any) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(10, 18),
    [theme.breakpoints.down(1180)]: {
      padding: theme.spacing(10, 12)
    },
    [theme.breakpoints.down(900)]: {
      flex: 0,
      padding: theme.spacing(5, 3),
      maxWidth: 432
    }
  }),
  formStyle: (theme: any) => ({
    margin: theme.spacing(10, 13, 10, 0),
    width: '100%',
    maxWidth: 432,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(10, 10, 10, 0)
    },
    [theme.breakpoints.down(900)]: {
      margin: theme.spacing(0, 'auto', 5)
    }
  }),
  footer: (theme: any) => ({
    px: 3,
    [theme.breakpoints.down(900)]: {
      textAlign: 'center'
    }
  })
};
