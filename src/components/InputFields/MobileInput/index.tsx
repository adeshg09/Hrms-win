/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to mobile input component.
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
  InputAdornment,
  MenuItem,
  OutlinedInput,
  OutlinedInputProps,
  Select
} from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */

/**
 *interface used to Handles mobile numbers from input and country code from select.
 *
 * @interface MobileInputProps
 * @property {string} name - name for input
 * @property {string} label - label text for the input
 * @property {string} size - size for the input form
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 * @property {number} countryCode - has value of selected dial code
 * @property {function} onCountryChange - function that handles change in dial code
 */
export interface MobileInputProps extends OutlinedInputProps {
  name: string;
  label?: string;
  size?: any;
  error?: boolean;
  helperText?: string;
  countryCode: number;
  onCountryChange: (val: number | string) => void;
}

// ----------------------------------------------------------------------

/**
 * Handles mobile numbers from input and country code from select.
 *
 * @Components
 * @param {string} name - name for input
 * @param {string} label - label text for the input
 * @param {string} size - size for the input form
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 * @param {number} countryCode - has value of selected dial code
 * @param {function} onCountryChange - function that handles change in dial code
 *
 * @returns {JSX.Element}
 */
const MobileInput = ({
  name,
  label = '',
  size = 'large',
  error = false,
  helperText = '',
  countryCode,
  onCountryChange,
  ...other
}: MobileInputProps): JSX.Element => {
  /* Hooks */
  const countries: Array<any> = [];

  /* Output */
  return (
    <FormControl fullWidth size={size} error={error}>
      {label && (
        <FormLabel sx={styles.formLabelStyle} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <OutlinedInput
        fullWidth
        id={name}
        name={name}
        inputProps={{ maxLength: 10 }}
        startAdornment={
          <InputAdornment position="start">
            <Select
              variant="filled"
              disableUnderline
              value={countryCode}
              MenuProps={{ sx: styles.countryCodeList }}
              onChange={(e) => {
                if (e.target.value && Number(e.target.value)) {
                  onCountryChange(+e.target.value);
                }
              }}
            >
              {(countries || []).map((option, i) => (
                <MenuItem key={i} value={option.countryIsdCode}>
                  {`+${option.countryIsdCode} ${option.countryIsoCode}`}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        }
        sx={styles.formInputStyle}
        {...other}
      />
      {error && helperText && (
        <FormHelperText sx={styles.formHelperTextStyle} error>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(MobileInput);
