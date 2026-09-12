/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Tracker Detail Header component.
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
import { Box, Chip, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to TrackerDetailHeader component for showing the data.
 *
 * @interface TrackerDetailHeaderProps
 * @property {string} projectName - projectName
 * @property {string} taskSummary - taskSummary
 * @property {moment.Moment} startTime - startTime
 * @property {moment.Moment} endTime - endTime
 * @property {string} workingTime - workingTime
 * @property {string} idealTime - idealTime
 */

export interface TrackerDetailHeaderProps {
  projectName: string;
  taskSummary: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
  workingTime: string;
  idealTime: string;
}

// ----------------------------------------------------------------------

/**
 * Component to create the TrackerDetailHeader.
 *
 * @component
 * @returns {JSX.Element}
 */
const TrackerDetailHeader = ({
  projectName,
  taskSummary,
  startTime,
  endTime,
  workingTime,
  idealTime
}: TrackerDetailHeaderProps): JSX.Element => {
  return (
    <Box mb={2}>
      <Box sx={styles.flexBox} mb={0.5}>
        <Chip size="small" color="primary" label={projectName} />
        <Typography variant="body2">{taskSummary}</Typography>
      </Box>

      <Box sx={styles.flexBox}>
        <Typography variant="caption" component="span" sx={styles.timeRange}>
          {`${startTime.format('hh:mm A')} - ${endTime.format('hh:mm A')}`}
        </Typography>
        <Chip
          icon={<TimerIcon />}
          size="small"
          color="success"
          variant="outlined"
          label={`${workingTime} hrs`}
          sx={styles.timeChip}
        />
        {idealTime && (
          <Chip
            icon={<TimerOffIcon />}
            size="small"
            color="error"
            variant="outlined"
            label={`${idealTime} hrs`}
            sx={styles.timeChip}
          />
        )}
      </Box>
    </Box>
  );
};

export default TrackerDetailHeader;
