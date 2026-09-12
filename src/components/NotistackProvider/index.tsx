/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create notistack provider(snackbar) component.
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

/* Imports */
import React, { memo } from 'react';
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create styling icon container for snackbar.
 *
 * @interface SnackbarIconProps
 * @property {any} icon - title for the snackbar.
 * @property {string} color - sub title for the snackbar.
 */
export interface SnackbarIconProps {
  icon: any;
  color: string;
}

/**
 * Interface used to create component to shows message for a brief moment at right-top corner.
 *
 * @interface SnackbarProps
 * @property {node} children - contains data or component.
 */
export interface SnackbarProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/* Styles */
/**
 * styling icon container for snackbar
 * @param {object} icon - icon for snackbar
 * @param {string} color - color for icon container
 */
const SnackbarIcon = ({ icon, color }: SnackbarIconProps): JSX.Element => {
  const IconSnackbar = icon;
  return (
    <Box
      component="span"
      sx={{
        ...styles.iconBox,
        color: `${color}.main`
      }}
    >
      <IconSnackbar width={24} height={24} />
    </Box>
  );
};

// ----------------------------------------------------------------------

// const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
//   '& .SnackbarContent-root': {
//     backgroundColor: theme.palette.background.default,
//     color: theme.palette.text.primary,
//     borderRadius: 0.75,
//     padding: theme.spacing(1, 2, 1, 1.25),
//     maxWidth: 320,
//     '&.SnackbarItem-variantSuccess': {
//       borderLeft: `8px solid ${theme.palette.success.main}`
//     },
//     '&.SnackbarItem-variantError': {
//       borderLeft: `8px solid ${theme.palette.error.main}`
//     },
//     '&.SnackbarItem-variantWarning': {
//       borderLeft: `8px solid ${theme.palette.warning.main}`
//     },
//     '&.SnackbarItem-variantInfo': {
//       borderLeft: `8px solid ${theme.palette.info.main}`
//     }
//   },
//   '& .SnackbarItem-message': {
//     flex: 1
//   },
//   '& .SnackbarItem-action': {
//     paddingLeft: 1,
//     marginTop: -0.25,
//     marginRight: -0.5,
//     alignSelf: 'flex-start',
//     '& > .MuiIconButton-root': {
//       padding: 0
//     }
//   }
// }));

// const useStyles = makeStyles({
//   containerRoot: { ...styles.rootStyle }
// });

// ----------------------------------------------------------------------

/**
 * Shows message for a brief moment at right-top corner
 * @param {node} children - contains data to be displayed.
 *
 * @component
 */
const NotistackProvider = ({ children }: SnackbarProps): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.rootStyle}>
      <SnackbarProvider
        // <StyledSnackbarProvider
        // <Box
        //   component={SnackbarProvider}
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        iconVariant={{
          success: <SnackbarIcon icon={CheckCircleIcon} color="success" />,
          error: <SnackbarIcon icon={CancelIcon} color="error" />,
          warning: <SnackbarIcon icon={ErrorIcon} color="warning" />,
          info: <SnackbarIcon icon={InfoIcon} color="info" />
        }}
        // classes={{
        //   containerRoot: styles.rootStyle
        // }}
        // sx={styles.rootStyle}
      >
        {children}
        {/* </Box> */}
        {/* </StyledSnackbarProvider> */}
      </SnackbarProvider>
    </Box>
  );
};

export default memo(NotistackProvider);
