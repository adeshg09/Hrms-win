/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create theme mode setting component.
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
import { Box, Tooltip } from '@mui/material';

/* Relative Imports */
import useSettings from 'hooks/useSettings';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------
/**
 * Component to change the theme mode settings.
 *
 * @component
 */
const ThemeModeSetting = (): JSX.Element => {
  /* Hooks */
  const { themeMode, switchMode } = useSettings();

  /* Output */
  return (
    <>
      <Box onClick={switchMode} sx={styles.rootStyle}>
        {themeMode === 'dark' ? (
          <Tooltip title="Light Mode" arrow>
            <Box
              component="img"
              alt="i"
              src="/assets/icon/SunIcon.svg"
              width="100%"
            />
          </Tooltip>
        ) : (
          <Tooltip title="Dark Mode" arrow>
            <Box
              component="img"
              alt="i"
              src="/assets/icon/MoonIcon.svg"
              width="100%"
            />
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default memo(ThemeModeSetting);
