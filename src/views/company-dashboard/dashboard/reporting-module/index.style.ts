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
 * Style object for tracker pages/components
 *
 * @returns {object}
 */
export default {
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItem: 'flex-start'
  },
  projectIcon: (theme: any) => ({
    color: theme.palette.secondary.main,
    ml: 0.5,
    mr: 1.5
  }),
  hr: (theme: any) => ({
    width: '100%',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: theme.palette.secondary.light,
    my: 3
  })
};
