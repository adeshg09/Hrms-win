/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Accordian component.
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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to Accordian component for showing the data.
 *
 * @interface AccordianProps
 * @property {boolean} defaultExpanded - paging for the data of table
 * @property {string} title - initial page size to show on pages of the data table
 * @property {string} workingTime - show results for the data of table
 * @property {string} idealTime - show rows per page for the data of table
 * @property {node} children - loading for the data to load
 */

export interface AccordianProps {
  defaultExpanded: boolean;
  title: string;
  workingTime?: string;
  idealTime?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Component to create the Accordian.
 *
 * @component
 * @returns {JSX.Element}
 */
const Accordian = ({
  defaultExpanded,
  title,
  workingTime,
  idealTime,
  children
}: AccordianProps): JSX.Element => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={styles.accordianRootContainer}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">{title}</Typography>
        <Chip
          icon={<TimerIcon />}
          size="medium"
          color="success"
          label={`${workingTime} hrs`}
          sx={styles.timeChip}
        />
        {idealTime && (
          <Chip
            icon={<TimerOffIcon />}
            size="medium"
            color="error"
            label={`${idealTime} hrs`}
            sx={styles.timeChip}
          />
        )}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default Accordian;
