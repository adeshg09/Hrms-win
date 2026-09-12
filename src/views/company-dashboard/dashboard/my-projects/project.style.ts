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
  taskdesc: (theme: any) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem'
    // paddingBottom: 15
  }),
  taskdetail: (theme: any) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    // paddingLeft: 20,
    '&:not(:last-child)': {
      paddingBottom: 10
    }
  }),
  list: {
    padding: 0
  },
  listitem: {
    padding: '1px 0'
  },
  nodataIcon: {
    paddingRight: 5
  },
  nodatatext: (theme: any) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    minHeight: 200,
    padding: 16
  }),
  accordion: {
    '&.MuiAccordion-root': {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:first-child)': {
        marginTop: '16px'
      },
      '&:before': {
        display: 'none'
      }
    },
    '&.Accordion-expanded': {}
  },
  accordionSummary: {
    '&.MuiAccordionSummary-root': {
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
        borderBottom: '1px solid rgba(0, 0, 0, .125)'
      }
    },
    '&.MuiAccordionSummary-content': {
      '&$expanded': {
        margin: '12px 0'
      }
    },
    '&.MuiAccordionSummary-expanded': {}
  },
  accordionDetails: (theme: any) => ({
    '&.MuiAccordionDetails-root': {
      padding: theme.spacing(2),
      background:
        theme.palette.mode === 'light'
          ? theme.palette.common.white
          : theme.palette.grey[900],
      display: 'block'
    }
  }),
  projectItemCardStyle: (theme: any) => ({
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.common.white
        : theme.palette.grey[900]
  }),
  projectItemHeaderStyle: (theme: any) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 77
  }),
  mbottom: (theme: any) => ({
    marginBottom: theme.spacing(3)
  }),
  viewItemTitle: {
    // color: theme.palette.common.white
  },

  viewItemBody: {
    // color: theme.palette.text.primary
  },
  viewItemDescriptionBody: {
    '& p': { padding: 0, margin: 0 }
  },
  viewPopover: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100vh'
    // width: 'auto',
    // height: 'auto'
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
  }
};
