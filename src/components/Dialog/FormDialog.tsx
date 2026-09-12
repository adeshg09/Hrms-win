/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create form dialog component.
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
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create popup dialog component for Form.
 *
 * @interface FormDialogProps
 * @property {boolean} open - to open and close the dialog
 * @property {boolean} disabled - to disable the button
 * @property {string} title - title for the form
 * @property {string} description - describing the form message
 * @property {boolean} isSubmitting - to show the loading for button
 * @property {string} submitText - text for 'Yes' button
 * @property {string} cancelText - text for 'No' button
 * @property {function} onSubmitAction - action for 'Yes' button
 * @property {function} onCancelAction -action for 'No' button
 * @property {node} children - contains data or component
 */
export interface FormDialogProps {
  open?: boolean;
  disabled?: boolean;
  title: string;
  description?: string | null;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmitAction: () => void;
  onCancelAction: () => void;
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Popup dialog component for Form
 *
 * @Components
 * @param {boolean} open - to open and close the dialog
 * @param {boolean} disabled - to disable the button
 * @param {string} title - title for the form
 * @param {string} description - describing the form message
 * @param {boolean} isSubmitting - to show the loading for button
 * @param {string} submitText - text for 'Yes' button
 * @param {string} cancelText - text for 'No' button
 * @param {function} onSubmitAction - action for 'Yes' button
 * @param {function} onCancelAction -action for 'No' button
 * @param {node} children - contains data or component
 * @returns {JSX.Element}
 */
const FormDialog = ({
  open = false,
  disabled = false,
  title,
  description = null,
  isSubmitting = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  onSubmitAction,
  onCancelAction,
  children
}: FormDialogProps): JSX.Element => {
  /* Output */
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}

        <Box pt={2}>{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="buttonCancel"
          variant="outlined"
          size="small"
          onClick={onCancelAction}
        >
          {cancelText}
        </Button>
        <LoadingButton
          data-testid="buttonSubmit"
          size="small"
          variant="contained"
          loading={isSubmitting}
          disabled={disabled}
          onClick={onSubmitAction}
        >
          {submitText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FormDialog);
