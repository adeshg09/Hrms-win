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
  // tabs: {
  //   '& .MuiTab-root': {
  //     textTransform: 'none',
  //     borderRadius: '16px',
  //     backgroundColor: '#e0e0e0', // Default background color
  //     color: '#000', // Default text color
  //     padding: '4px 16px', // Adjust padding to make it smaller
  //     minWidth: '80px', // Decrease width
  //     fontSize: '0.875rem', // Reduce font size
  //     margin: '0 16px', // Adjust spacing between tabs
  //     borderBottom: 'none', // Remove
  //     '&.Mui-selected': {
  //       backgroundColor: '#007bff', // Selected background color
  //       color: '#fff' // Selected text color
  //     }
  //   },
  //   '& .MuiTabs-indicator': {
  //     display: 'none !important'
  //   }
  // },
  tabs: {
    '& .MuiTab-root': {
      textTransform: 'none',
      minWidth: '80px',
      fontSize: '0.875rem',
      marginRight: '16px',
      padding: '6px 12px',
      '&.Mui-selected': {
        color: '#1976d2' // MUI's default primary color
      }
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#1976d2' // MUI's default primary color
    }
  },
  timeChip: {
    height: 28,
    '& .MuiChip-label': {
      fontStyle: 'italic'
    }
  }
};
