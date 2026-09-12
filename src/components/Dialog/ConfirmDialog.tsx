/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create confirmation dialog component.
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
 * Interface used to create popup dialog component for confirmation message.
 *
 * @interface ConfirmDialogProps
 * @property {boolean} open - to open and close the dialog
 * @property {string|node} title - title for the dialog
 * @property {string|node} description - describing the confirmation message
 * @property {boolean} isSubmitting - to show the loading for button
 * @property {string} agreeText - text for 'Yes' button
 * @property {string} disagreeText - text for 'No' button
 * @property {function} onAgreeAction - action for 'Yes' button
 * @property {function} onDisAgreeAction - action for 'No' button
 */
export interface ConfirmDialogProps {
  open?: boolean;
  title?: string | React.ReactNode;
  description: string | React.ReactNode;
  isSubmitting?: boolean;
  agreeText?: string;
  disagreeText?: string;
  onAgreeAction: () => void;
  onDisAgreeAction: () => void;
}

// ----------------------------------------------------------------------

/**
 * Popup dialog component for confirmation message
 *
 * @component
 * @param {boolean} open - to open and close the dialog
 * @param {string|node} title - title for the dialog
 * @param {string|node} description - describing the confirmation message
 * @param {boolean} isSubmitting - to show the loading for button
 * @param {string} agreeText - text for 'Yes' button
 * @param {string} disagreeText - text for 'No' button
 * @param {function} onAgreeAction - action for 'Yes' button
 * @param {function} onDisAgreeAction - action for 'No' button
 * @returns {JSX.Element}
 */
const ConfirmDialog = ({
  open = false,
  title,
  description,
  isSubmitting = false,
  agreeText = 'Agree',
  disagreeText = 'Disagree',
  onAgreeAction,
  onDisAgreeAction
}: ConfirmDialogProps): JSX.Element => {
  /* Output */
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="buttonDisagree"
          variant="outlined"
          size="small"
          onClick={onDisAgreeAction}
        >
          {disagreeText}
        </Button>
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

export default memo(ConfirmDialog);
