/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create Document Type Page to add/edit Document Type.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Devanshu Sharma
 * Date Created: 20/March/2025
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------
import { useState, useContext } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SessionContext from 'context/SessionContext';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { DesignationFormValues } from 'models/company';
import { insertDesignationRequest } from 'services/company/designation';
import { TextInput } from 'components/InputFields';

interface PopupAddDesignationProps {
  open: boolean;
  onClose: () => void;
}

const PopupAddDesignation: React.FC<PopupAddDesignationProps> = ({
  open,
  onClose
}) => {
  const { user } = useContext(SessionContext);
  const { showSnackbar } = useSnackbarClose();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    txtDesignationName: ''
  };

  const validationSchema = Yup.object().shape({
    txtDesignationName: Yup.string()
      .trim()
      .required('Please enter the designation name.')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed')
  });

  const handleFormSubmit = async (
    values: DesignationFormValues,
    { resetForm }: any
  ): Promise<void> => {
    setLoading(true);
    try {
      const requestData: any = {
        designationName: values.txtDesignationName.trim(),
        createdBy: user.id
      };
      const response = await insertDesignationRequest(requestData);
      if (response?.status.response_code === 200) {
        resetForm();
        showSnackbar(
          toastMessages.success.adminDashboard.designationSaved,
          'success'
        );
        onClose();
      } else if (response?.status.response_code === 206) {
        showSnackbar(
          toastMessages.error.adminDashboard.designationDuplicate,
          'error'
        );
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
      <DialogTitle>Add Designation</DialogTitle>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values
        }) => (
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <TextInput
                fullWidth
                label="Designation Name"
                name="txtDesignationName"
                value={values.txtDesignationName}
                inputProps={{ maxLength: 50 }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched.txtDesignationName && errors.txtDesignationName
                )}
                helperText={String(
                  touched.txtDesignationName && errors.txtDesignationName
                )}
              />
            </DialogContent>
            <Divider />
            <DialogActions>
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={loading}
              >
                Save
              </LoadingButton>
              <Button color="secondary" variant="contained" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PopupAddDesignation;
