/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create loader component.
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
import { GridLoader } from 'react-spinners';
import { Box, useTheme } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create component to displays animated loading screen.
 *
 * @interface Props
 * @property {number} size - size fo the loader
 * @property {object|function} containerStyle - custom styles
 */
export interface Props {
  size?: number;
  containerStyle?: object | (() => void);
}

// ----------------------------------------------------------------------

/**
 * Component displays animated loading screen.
 *
 * @component
 * @param {number} size - size fo the loader
 * @param {object|function} containerStyle - custom styles
 */
const Loader = ({
  size = 8,
  containerStyle = {},
  ...other
}: Props): JSX.Element => {
  /* Hooks */
  const theme = useTheme();

  /* Output */
  return (
    <Box
      data-testid="loader"
      sx={[styles.rootStyle, containerStyle]}
      {...other}
    >
      <GridLoader size={size} color={theme.palette.primary.main} />
    </Box>
  );
};

export default memo(Loader);
