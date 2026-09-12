/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create scrollbar component.
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
import React, { memo } from 'react';
import SimpleBarReact, { Props as SimpleBarProps } from 'simplebar-react';
import { Box } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * styling the logo for Website.
 *
 * @interface SimpleBarProps
 * @property {node} children - contains data or component
 * @property {object} sx - contains the styles
 */
export interface Props extends SimpleBarProps {
  children?: React.ReactNode;
  sx?: object;
}

// ----------------------------------------------------------------------

/**
 * styling the logo for Website.
 *
 * @component
 * @param {node} children - contains data or component
 * @param {object} sx - contains the styles
 * @returns {JSX.Element}
 */
const Scrollbar = ({
  children = <></>,
  sx = undefined,
  ...other
}: Props): JSX.Element => {
  /* Constants */
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  /* Output */
  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={styles.rootStyle}>
      <SimpleBarReact
        // timeout={500}
        clickOnTrack={false}
        style={{ maxHeight: '100%', ...sx }}
        {...other}
      >
        {children}
      </SimpleBarReact>
    </Box>
  );
};

export default memo(Scrollbar);
