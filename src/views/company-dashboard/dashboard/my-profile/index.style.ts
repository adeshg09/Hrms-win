import { Theme } from '@mui/material';

/**
 * Style object for profile components
 *
 * @returns {object}
 */
export default {
  // Profile Container Styles
  profileContainer: {
    p: 3
  },

  profileCard: (theme: Theme) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    overflow: 'visible'
  }),

  headerContent: () => ({
    p: 3,
    display: 'flex',
    alignItems: 'center',
    borderBottom: 1,
    borderColor: 'divider'
  }),

  avatarWrapper: {
    position: 'relative'
  },

  avatar: (theme: Theme) => ({
    width: 100,
    height: 100,
    border: 3,
    borderColor: 'background.paper',
    [theme.breakpoints.down('sm')]: {
      width: 80,
      height: 80
    }
  }),

  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%'
  },

  userInfo: () => ({
    ml: 3
  }),

  profileDetails: {
    p: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // This ensures space between the cards
    flexWrap: 'wrap', // Allow wrapping if space is tight
    gap: '10px' // Space between cards
  },

  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2
  },

  icon: (theme: any) => ({
    color: theme.palette.primary.main
  }),

  divider: {
    mt: 3,
    mb: 3
  },

  // Hidden input for file upload
  hiddenInput: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: '1px'
  } as React.CSSProperties
};
