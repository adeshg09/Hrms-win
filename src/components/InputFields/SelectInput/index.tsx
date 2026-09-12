/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to select input component.
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
  BaseSelectProps,
  FormControl,
  FormHelperText,
  FormLabel,
  Select
} from '@mui/material';

/* local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */

/**
 * Handles select from Select Input
 *
 * @interface SelectInputProps
 * @property {string} name - name for select
 * @property {string} label - label text for the select
 * @property {string} placeholder - placeholder text for the select
 * @property {string} size - size for the select form
 * @property {boolean} required - to indicate select is required or not
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 */
export interface SelectInputProps extends BaseSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  size?: any;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  children?: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Handles select from Select Input
 *
 * @Components
 * @param {string} name - name for select
 * @param {string} label - label text for the select
 * @param {string} placeholder - placeholder text for the select
 * @param {string} size - size for the select form
 * @param {boolean} required - to indicate select is required or not
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 *
 * @returns {JSX.Element}
 */
const SelectInput = ({
  name,
  label = '',
  placeholder,
  size = 'large',
  required = false,
  error = false,
  helperText = '',
  children = <></>,
  ...other
}: SelectInputProps): JSX.Element => {
  /* Output */
  return (
    <FormControl
      fullWidth
      variant="standard"
      size={size}
      required={required}
      error={error}
      sx={styles.formControlStyle}
    >
      {label && (
        <FormLabel sx={styles.formLabelStyle} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Select
        fullWidth
        id={name}
        name={name}
        placeholder={placeholder}
        displayEmpty
        variant="outlined"
        inputProps={{ 'aria-label': 'Without label' }}
        {...other}
      >
        {children}
      </Select>
      {error && helperText && (
        <FormHelperText error sx={styles.formHelperTextStyle}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(SelectInput);
