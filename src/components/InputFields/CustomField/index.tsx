/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to custom field component.
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
import { FormGroup, FormHelperText, FormLabel } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * interface used to Handles text from Input
 *
 * @interface CustomFieldProps
 * @property {string} name - name for input
 * @property {string} label - label text for the input
 * @property {boolean} required - to indicate input is required or not
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 * @property {node} children - contains data or component
 */
export interface CustomFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Handles text from Input
 *
 * @Components
 * @param {string} name - name for input
 * @param {string} label - label text for the input
 * @param {boolean} required - to indicate input is required or not
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 * @param {node} children - contains data or component
 *
 * @returns {JSX.Element}
 */
const CustomField = ({
  name,
  label = '',
  required = false,
  error = false,
  helperText = '',
  children
}: CustomFieldProps): JSX.Element => {
  /* Output */
  return (
    <FormGroup>
      <FormLabel
        htmlFor={name}
        required={required}
        error={error}
        sx={styles.formLabelStyle}
      >
        {label}
      </FormLabel>
      {children}
      {error && helperText && (
        <FormHelperText error sx={{ ml: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormGroup>
  );
};

export default memo(CustomField);
