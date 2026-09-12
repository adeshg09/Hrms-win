/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create alert dialog component.
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
  // Button,
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
 * Interface used to create popup dialog component for alert message.
 *
 * @interface AlertDialogProps
 * @property {boolean} open - to open and close the dialog
 * @property {string|node} title - title for the dialog
 * @property {string|node} description - describing the alert message
 * @property {boolean} isSubmitting - to show the loading for button
 * @property {string} agreeText - text for 'OK' button
 * @property {function} onAgreeAction - action for 'OK' button
 */
export interface AlertDialogProps {
  open?: boolean;
  title?: string | React.ReactNode;
  description: string | React.ReactNode;
  isSubmitting?: boolean;
  agreeText?: string;
  // disagreeText?: string;
  onAgreeAction: () => void;
}

// ----------------------------------------------------------------------

/**
 * Popup dialog component for alert message
 *
 * @component
 * @param {boolean} open - to open and close the dialog
 * @param {string|node} title - title for the dialog
 * @param {string|node} description - describing the alert message
 * @param {boolean} isSubmitting - to show the loading for button
 * @param {string} agreeText - text for 'Yes' button
 * @param {function} onAgreeAction - action for 'Yes' button
 * @returns {JSX.Element}
 */
const AlertDialog = ({
  open = false,
  title,
  description,
  isSubmitting = false,
  agreeText = 'OK',
  onAgreeAction
}: AlertDialogProps): JSX.Element => {
  /* Output */
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          data-testid="buttonAgree"
          size="small"
          variant="contained"
          loading={isSubmitting}
          onClick={onAgreeAction}
        >
          {agreeText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AlertDialog);
