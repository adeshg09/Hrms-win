import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'components/InputFields';
import { insertDocumentType } from 'services/company/documentType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';

/* Interface for Props */
interface PopupAddDocumentProps {
  open: boolean;
  onClose: () => void;
}

/* Initial Form Values */
const initialValues = {
  txtDocumentTypeName: ''
};

/* Validation Schema */
const validationSchema = Yup.object().shape({
  txtDocumentTypeName: Yup.string()
    .trim()
    .required('Please enter the Document Type name.')
    .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed')
});

const PopupAddDocument: React.FC<PopupAddDocumentProps> = ({
  open,
  onClose
}) => {
  const { showSnackbar } = useSnackbarClose();
  const [loading, setLoading] = useState(false);
  console.log('POP up add document called');
  /* Handle Form Submission */
  const handleFormSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ): Promise<void> => {
    setLoading(true);
    try {
      const requestData: any = {
        documentTypeName: values.txtDocumentTypeName.trim()
      };
      const response = await insertDocumentType(requestData);

      if (response?.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.documentSaved,
          'success'
        );
        resetForm();
        onClose();
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Document Type</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <DialogContent>
              <TextInput
                fullWidth
                label="Document Type Name"
                name="txtDocumentTypeName"
                value={values.txtDocumentTypeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched.txtDocumentTypeName && errors.txtDocumentTypeName
                )}
                helperText={String(
                  touched.txtDocumentTypeName && errors.txtDocumentTypeName
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PopupAddDocument;
