/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Tracker Detail Card component.
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
import moment from 'moment';
import { Box, Typography } from '@mui/material';
import { Mouse, Keyboard } from '@mui/icons-material';

/* Relative Imports */
import { apiBaseUrl } from 'config/config';
import { TrackerDetailModel } from 'models/company';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to TrackerDetailCard component for showing the data.
 *
 * @interface TrackerDetailCardProps
 * @property {boolean} defaultExpanded - defaultExpanded
 * @property {string} title - title
 * @property {string} time - time
 * @property {string} idealTime - idealTime
 * @property {node} children - children
 */

export interface TrackerDetailCardProps {
  trackerDetail: TrackerDetailModel;
}

// ----------------------------------------------------------------------

/**
 * Component to create the TrackerDetailCard.
 *
 * @component
 * @returns {JSX.Element}
 */
const TrackerDetailCard = ({
  trackerDetail
}: TrackerDetailCardProps): JSX.Element => {
  const captureTime = moment(trackerDetail.capture_time, 'HH:mm:ss').format(
    'hh:mm A'
  );
  const isIdealCard = Boolean(
    trackerDetail.click_count === 0 && trackerDetail.key_count === 0
  );
  return (
    <Box sx={[styles.trackerDetailCard, isIdealCard ? styles.idealCard : {}]}>
      <Box sx={styles.screenShotThumbnailBox}>
        <Box
          component="img"
          src={`${apiBaseUrl}/${trackerDetail.screen_shot}`}
          alt=""
          width="100%"
        />
      </Box>
      <Box p={1.5}>
        <Box sx={styles.actionCounts}>
          <Box component="p" sx={styles.actionStats}>
            <Mouse fontSize="small" />
            <Typography component="span" variant="body2">
              {trackerDetail.click_count}
            </Typography>
          </Box>
          <Box component="p" sx={styles.actionStats}>
            <Keyboard />
            <Typography component="span" variant="body2">
              {trackerDetail.key_count}
            </Typography>
          </Box>
        </Box>
        <Box textAlign="center">
          <Typography component="span" variant="body2">
            {captureTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TrackerDetailCard;
