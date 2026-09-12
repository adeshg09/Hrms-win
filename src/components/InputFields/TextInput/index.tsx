/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to auto text input component.
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
import { memo } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  OutlinedInputProps
} from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Handles text from Input
 *
 * @interface TextInputProps
 * @property {string} name - name for input
 * @property {string} label - label text for the input
 * @property {string} size - size for the input form
 * @property {boolean} required - to indicate input is required or not
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 */
export interface TextInputProps extends OutlinedInputProps {
  name: string;
  label?: string;
  size?: any;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

// ----------------------------------------------------------------------

/**
 * Handles text from Input
 *
 * @Components
 * @param {string} name - name for input
 * @param {string} label - label text for the input
 * @param {string} size - size for the input form
 * @param {boolean} required - to indicate input is required or not
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 *
 * @returns {JSX.Element}
 */
const TextInput = ({
  name,
  label = '',
  size = 'large',
  required = false,
  error = false,
  helperText = '',
  ...other
}: TextInputProps): JSX.Element => {
  /* Output */
  return (
    <FormControl fullWidth required={required} size={size} error={error}>
      {label && (
        <FormLabel sx={styles.formLabelStyle} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <OutlinedInput fullWidth id={name} name={name} {...other} />
      {error && helperText && (
        <FormHelperText sx={styles.formHelperTextStyle} error>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(TextInput);
