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

import { alpha } from '@mui/material';

/**
 * Style object for auth pages/components
 *
 * @returns {object}
 */
export default {
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  trackerDetailCard: (theme: any) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.background.default
        : theme.palette.background.paper,
    borderRadius: 0.5,
    overflow: 'hidden'
  }),
  idealCard: (theme: any) => ({
    border: `1px solid ${theme.palette.error.main}`,
    opacity: 0.25
  }),
  timeRange: {
    fontStyle: 'italic'
  },
  timeChip: (theme: any) => ({
    height: 22,
    '& .MuiChip-label': {
      ...theme.typography.caption,
      fontStyle: 'italic'
    }
  }),
  screenShotThumbnailBox: {
    minHeight: 60
  },
  actionCounts: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center',
    mb: 1
  },
  actionStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    m: 0
  },
  mainPopover: {
    '.MuiPopover-paper': {
      top: '50% !important',
      left: '16px',
      right: '16px',
      width: '100%'
    }
  },
  popupOverlay: (theme: any) => ({
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.common.black, 0.5),
    cursor: 'pointer',
    zIndex: 1299
  }),
  popupCard: (theme: any) => ({
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    '-ms-transform': 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    /* background-color: white, */
    // width: '70%',
    width: '95%',
    /* height: 70%, */
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '15px',
    zIndex: 1300,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }),
  screenShot: (theme: any) => ({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    marginTop: '10px',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }),
  popupCloseIcon: (theme: any) => ({
    position: 'absolute',
    top: '1%',
    left: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.87)',
    color: theme.palette.grey[900],
    borderRadius: '25%',
    margin: '5px'
  })
};
