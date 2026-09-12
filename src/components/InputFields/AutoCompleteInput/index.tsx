/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to auto complete input component.
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
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField
} from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to Handles text from AutoComplete
 *
 * @interface AutoCompleteInputProps
 * @property {string} name - name for select
 * @property {string} label - label text for the select
 * @property {any} value - value for the select
 * @property {any} data - data for the select
 * @property {any} originalData - originalData for the select
 * @property {func} onChange - function for the select
 * @property {func} onInputChange - function for the input chenge in select
 * @property {string} itemId - itemId for the input select options
 * @property {string} itemName - itemName for the input select options
 * @property {string} placeholder - placeholder text for the input select
 * @property {string} size - size for the select form
 * @property {boolean} multiple - to indicate select is multiple or not
 * @property {number} limitTags - to limit tags shown in select
 * @property {boolean} loading - to indicate select is loading or not
 * @property {boolean} required - to indicate select is required or not
 * @property {boolean} error - contains error message
 * @property {string} helperText - it shows the hints
 */
// export interface AutoCompleteInputProps extends AutocompleteProps {  // Creating some error solve it
export interface AutoCompleteInputProps {
  name: string;
  label?: string;
  value: any;
  data: any;
  originalData: any;
  onChange?: (val: any) => void;
  onInputChange?: (val: string) => void;
  itemId?: string;
  itemName?: string;
  placeholder: string;
  size?: any;
  multiple?: boolean;
  disabled?: boolean;
  renderOption?: any;
  limitTags?: number;
  loading?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

// ----------------------------------------------------------------------

/**
 * Handles text from AutoComplete
 *
 * @Components
 * @param {string} name - name for select
 * @param {string} label - label text for the select
 * @param {any} value - value for the select
 * @param {any} data - data for the select
 * @param {any} originalData - originalData for the select
 * @param {func} onChange - function for the select
 * @param {func} onInputChange - function for the input chenge in select
 * @param {string} itemId - itemId for the input select options
 * @param {string} itemName - itemName for the input select options
 * @param {string} placeholder - placeholder text for the input select
 * @param {string} size - size for the select form
 * @param {boolean} multiple - to indicate select is multiple or not
 * @param {number} limitTags - to limit tags shown in select
 * @param {boolean} loading - to indicate select is loading or not
 * @param {boolean} required - to indicate select is required or not
 * @param {boolean} error - contains error message
 * @param {string} helperText - it shows the hints
 *
 * @returns {JSX.Element}
 */

const AutoCompleteInput = ({
  name,
  label = '',
  value,
  data,
  originalData,
  onChange = () => {},
  onInputChange,
  itemId = '',
  itemName = '',
  placeholder,
  size = 'small',
  multiple = false,
  limitTags = 1,
  loading = false,
  required = false,
  error = false,
  helperText = '',
  ...other
}: AutoCompleteInputProps): JSX.Element => {
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
      <Autocomplete
        fullWidth
        disableCloseOnSelect={multiple}
        forcePopupIcon={false}
        multiple={multiple}
        id={name}
        size={size}
        limitTags={limitTags}
        loading={loading}
        value={value}
        options={data}
        getOptionLabel={(option: any) =>
          itemName
            ? (originalData?.find((val: any) => val[`${itemId}`] === option) &&
                originalData.find((val: any) => val[`${itemId}`] === option)[
                  `${itemName}`
                ]) ||
              ''
            : option
        }
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} />
        )}
        onInputChange={(evt, newVal) => {
          if (onInputChange) {
            onInputChange(newVal);
          }
        }}
        {...other}
      />
      {error && helperText && (
        <FormHelperText error sx={styles.formHelperTextStyle}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(AutoCompleteInput);
