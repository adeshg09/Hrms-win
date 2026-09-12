/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create website logo component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, BoxProps, Link } from '@mui/material';

/* Relative Imports */
import { ROOT_PATH } from 'routes/paths';
// import SessionContext from 'context/SessionContext';
// import { apiBaseUrl } from 'config/config';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * styling the logo for Website.
 *
 * @interface BoxProps
 * @property {boolean} isIcon - flag to show original logo or icon
 */
export interface Props extends BoxProps {
  isIcon?: boolean;
  isClickable?: boolean;
}

// ----------------------------------------------------------------------

/**
 * styling the logo for Website.
 *
 * @component
 * @param {boolean} isIcon - flag to show original logo or icon
 * @returns {JSX.Element}
 */
const WebsiteLogo = ({
  isIcon = false,
  isClickable = true,
  ...other
}: Props): JSX.Element => {
  /* Hooks */
  // const { isFromMaster, company } = useContext(SessionContext);

  /* Output */
  return isClickable ? (
    <Link
      component={RouterLink}
      underline="none"
      to={ROOT_PATH}
      sx={styles.logoLink}
    >
      <Box
        component="img"
        alt="logo"
        src={
          isIcon
            ? '/assets/images/time-icon.svg'
            : // : (!isFromMaster &&
              //     company?.logo &&
              //     `${apiBaseUrl}${company.logo}`) ||
              '/assets/images/te-projects-logo.png'
        }
        sx={styles.logo}
        {...other}
      />
    </Link>
  ) : (
    <Box sx={styles.logoLink}>
      <Box
        component="img"
        alt="logo"
        src={
          isIcon
            ? '/assets/images/time-icon.svg'
            : // (!isFromMaster &&
              //     company?.logo &&
              //     `${apiBaseUrl}${company.logo}`) ||
              '/assets/images/te-projects-logo.png'
        }
        sx={styles.logo}
        {...other}
      />
    </Box>
  );
};

export default memo(WebsiteLogo);
