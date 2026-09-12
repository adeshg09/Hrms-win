/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create Header for company dashboard pages.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import {
  Box,
  Container,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

/* Relative Imports */
import AccountPopover from 'components/AccountPopover';
import breakpoints from 'theme/breakpoints';

/* Local Imports */
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create header for the company dashboard pages.
 *
 * @interface HeaderProps
 * @property {function} onMobileNavOpen - callback function to handle open/close on click of side bar icon.
 */
export interface HeaderProps {
  onMobileNavOpen: any;
}

// ----------------------------------------------------------------------

/**
 * Header for the company dashboard pages
 *
 * @component
 * @param {function} onMobileNavOpen - callback function to handle open/close on click of side bar icon.
 * @returns {JSX.Element}
 */
const Header = ({ onMobileNavOpen }: HeaderProps): JSX.Element => {
  /* Hooks */
  const theme = useTheme();
  const laptopDownMatches = useMediaQuery(
    theme.breakpoints.down(breakpoints.values.laptop)
  );

  /* Output */
  return (
    <Container maxWidth={false} sx={styles.header}>
      {laptopDownMatches && (
        <IconButton onClick={onMobileNavOpen} sx={styles.menuIcon}>
          <MenuIcon />
        </IconButton>
      )}
      <Box sx={styles.rightOptions}>
        <AccountPopover />
      </Box>
    </Container>
  );
};

export default memo(Header);
