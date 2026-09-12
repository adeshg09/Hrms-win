/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to styles for auto complete input component.
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
  formControlStyle: {
    display: 'flex'
  },
  formLabelStyle: (theme: any) => ({
    position: 'relative',
    marginBottom: theme.spacing(0.5),
    width: '100%'
  }),
  formHelperTextStyle: (theme: any) => ({
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5)
  })
};
