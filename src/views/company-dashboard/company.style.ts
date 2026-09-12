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
  mainBox: {
    maxWidth: 800,
    margin: '16px auto 0'
  },
  actionItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1
  },
  addButton: {
    display: 'flex',
    marginTop: 'auto'
  },
  button: (theme: any) => ({
    margin: theme.spacing(1)
  }),
  mbottom: (theme: any) => ({
    marginBottom: theme.spacing(3)
  }),
  viewPopover: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100vh'
  },
  popoverView: {
    my: 1.5,
    px: 2.5,
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column'
  },
  popoverMainBox: {
    overflowY: 'auto'
  },
  closePopover: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  formControlLabel: {
    marginLeft: 0
  },
  tableProfileAvatar: {
    m: 'auto'
  },
  viewItemTitle: {
    // color: theme.palette.common.white
  },

  viewItemBody: {
    // color: theme.palette.text.primary
  },
  viewItemDescriptionBody: {
    '& p': { padding: 0, margin: 0 }
  }
};
