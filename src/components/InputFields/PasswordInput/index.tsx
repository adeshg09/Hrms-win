/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to auto password input component.
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
import { memo, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/* Relative Imports */
// import { PasswordEyeIcon } from 'assets/Icons';

/* Local Imports */
import { TextInput, TextInputProps } from '..';
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 *Interface used to Handles password value from input
 *
 * @interface PasswordInputProps
 * @property {string} name - name for input
 * @property {string} label - label text for the input
 * @property {string} value - entered input value
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 */
export interface PasswordInputProps extends TextInputProps {
  name: string;
  label?: string;
  value?: string;
  error?: boolean;
  helperText?: string;
}

// ----------------------------------------------------------------------

/**
 * Handles password value from input
 *
 * @Components
 * @param {string} name - name for input
 * @param {string} label - label text for the input
 * @param {string} value - entered input value
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 *
 * @returns {JSX.Element}
 */
const PasswordInput = ({
  name,
  label = '',
  value = '',
  error = false,
  helperText = '',
  ...other
}: PasswordInputProps): JSX.Element => {
  /* States */
  const [showPassword, setShowPassword] = useState(false);

  /* Functions */
  /**
   * Toggle visibility on click of icon
   * @returns {void}
   */
  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  /* Output */
  return (
    <TextInput
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      sx={styles.passwordInput}
      endAdornment={
        value && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
              sx={{ color: 'text.primary' }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }
      inputProps={{ maxLength: 100 }}
      error={error}
      helperText={helperText}
      {...other}
    />
  );
};

export default memo(PasswordInput);
