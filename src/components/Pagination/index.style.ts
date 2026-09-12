/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for pagination component.
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
  rootStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    gap: 2,
    height: 64
  },
  paginationOptions: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pagination: {
    px: 1,
    '& .MuiPagination-ul': {
      width: '100%',
      flexWrap: 'nowrap',
      justifyContent: 'center'
    }
  },
  selectStyle: (theme: any) => ({
    fontFamily: theme.typography.caption,
    color: 'text.secondary',
    minHeight: 0,
    height: 32,
    '& svg': {
      color: 'text.secondary',
      right: 4
    },
    '& .MuiSelect-select ': {
      paddingLeft: 1
    },
    [theme.breakpoints.down(560)]: {
      height: 24,
      '& svg': {
        width: 16,
        height: 16,
        right: 2,
        top: 'calc(50% - 0.3em)'
      },
      '& .MuiSelect-select ': {
        pl: 0.75,
        pr: '18px !important'
      }
    }
  })
};
