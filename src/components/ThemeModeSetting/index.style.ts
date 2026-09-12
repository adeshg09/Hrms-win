/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for theme mode setting component.
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

export default {
  rootStyle: {
    position: 'fixed',
    display: 'flex',
    transition: 'all',
    alignitems: 'center',
    bottom: { xs: 40, sm: 24, md: 24 },
    right: { xs: 12, sm: 24, md: 32 },
    zIndex: 9999,
    width: { xs: 24, sm: 32, md: 36 },
    cursor: 'pointer',
    borderRadius: '50%',
    overflow: 'hidden'
  }
};
