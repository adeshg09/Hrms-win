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

// import { Height } from '@mui/icons-material';

/**
 * Style object for tracker pages/components
 *
 * @returns {object}
 */
export default {
  accordianRootContainer: {
    '& .MuiAccordionDetails-root': {
      pl: 1,
      pr: 3
    },
    '& .MuiAccordionSummary-content': {
      gap: 2
    }
  },
  timeChip: {
    height: 28,
    '& .MuiChip-label': {
      fontStyle: 'italic'
    }
  }
};
