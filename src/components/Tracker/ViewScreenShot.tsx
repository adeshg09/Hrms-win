/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description View Screen Shot component.
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

/* Imports */
import { Box } from '@mui/material';
import { Close } from '@mui/icons-material';

/* Relative Imports */
import MenuPopover from 'components/MenuPopover';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to View Screen Shot component for showing the data.
 *
 * @interface ViewScreenShotProps
 * @property {string} screenShotUrl - screenShotUrl
 * @property {function} onClose - onClose
 */

export interface ViewScreenShotProps {
  screenShotUrl: string;
  onClose: () => void;
}

// ----------------------------------------------------------------------

/**
 * Component to create the View Screen Shot.
 *
 * @component
 * @returns {JSX.Element}
 */
const ViewScreenShot = ({
  screenShotUrl,
  onClose
}: ViewScreenShotProps): JSX.Element => {
  return (
    <MenuPopover
      open={!!screenShotUrl}
      onClose={onClose}
      sx={styles.mainPopover}
    >
      <Box sx={styles.popupOverlay} onClick={onClose} />
      <Box sx={styles.popupCard}>
        <Close onClick={onClose} sx={styles.popupCloseIcon} />
        <Box
          component="img"
          src={screenShotUrl}
          alt=""
          sx={styles.screenShot}
        />
      </Box>
    </MenuPopover>
  );
};

export default ViewScreenShot;
