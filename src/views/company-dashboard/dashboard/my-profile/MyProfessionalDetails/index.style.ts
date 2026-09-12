/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for master dashboard pages/components.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/**
 * Style object for auth pages/components
 *
 * @returns {object}
 */
export default {
  avatar: (theme: any) => ({
    height: 200,
    width: 200,
    [theme.breakpoints.down('xs')]: {
      height: 100,
      width: 100
    }
  }),

  mainGrid: (theme: any) => ({
    borderBottom: `1px solid ${theme.palette.divider}`
  }),
  profileParent: () => ({
    position: 'relative'
  }),
  editProfile: (theme: any) => ({
    position: 'absolute',
    top: 1.5,
    right: 0,
    padding: 2,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      top: 1
    }
  }),
  cardHeaderEdit: (theme: any) => ({
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left'
    }
  }),
  loadingspan: {
    width: 200,
    height: 200,
    position: 'relative',
    marginTop: -200,
    opacity: 0.7,
    backgroundColor: '#fff',
    borderRadius: '50%'
  },
  loadingimg: {
    width: 100,
    marginTop: 50
  },
  profileCard: {
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    marginBottom: 3,
    overflow: 'visible'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 3
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  userInfo: {
    marginLeft: 2
  },
  editButton: {
    borderRadius: '8px',
    textTransform: 'none'
  },
  infoLabel: {
    color: 'text.secondary',
    fontWeight: 500,
    marginBottom: 0.5
  },
  infoValue: {
    color: 'text.primary',
    fontWeight: 400,
    marginBottom: 2
  }
};
