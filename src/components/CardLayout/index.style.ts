/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for card layout components.
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
  card: (theme: any) => ({
    maxWidth: 1000,
    margin: '0 auto',
    backgroundColor: theme.palette.background.default,
    '& .MuiCardHeader-root': {
      textAlign: 'center'
    },
    '& .MuiCardActions-root': {
      justifyContent: 'center',
      gap: 2,
      '& .MuiButtonBase-root': {
        minWidth: 120
      }
    }
  })
};
