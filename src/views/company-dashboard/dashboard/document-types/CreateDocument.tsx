/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create Document Type Page to add/edit Document Type.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Shashikant Yadav
 * Date Created: 26/Dec/2024
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, CardActions, CardContent, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { AdminDashboardPage } from 'components/Page';
import SessionContext from 'context/SessionContext';
import useSnackbarClose from 'hooks/useSnackbarClose';

import { toastMessages } from 'constants/appConstant';
import Loader from 'components/Loader';
import { TextInput } from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import {
  getDocumentTypebyId,
  insertDocumentType,
  updateDocumentTypeRequest
} from 'services/company/documentType';
import { PAGE_COMPANY_DASHBOARD } from 'routes/paths';
import { DocumentTypeFormValues } from 'models/company/DocumentType';

/* Constants */
const manageDocuments = PAGE_COMPANY_DASHBOARD.manageDocuments.absolutePath;

/**
 * Component to create the form to save/update Dcoument Type.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateDocuments = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    txtDocumentTypeName: ''
  } as DocumentTypeFormValues);

  /* Functions */
  /**
   * function to get the Document Type by id with backend action
   * @param {string} documentTypeId - id of document type to fetch the detail
   * @returns {void}
   */
  const getDocumentbyId = async (documentTypeId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getDocumentTypebyId(Number(documentTypeId));
      if (response && response.status.response_code === 200) {
        const { documentType } = response;
        setInitialValues({ txtDocumentTypeName: documentType.name });
      } else {
        showSnackbar(toastMessages.error.common, 'errror');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update document type with backend action
   * @param {DocuementTypeFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: DocumentTypeFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        documentTypeName: values.txtDocumentTypeName.trim()
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateDocumentTypeRequest(
          Number(id),
          requestData
        );
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.documentTypeUpdated,
            'success'
          );
          navigate(manageDocuments);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.documentDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertDocumentType(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.documentSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.documentDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };
  /* SideEffects */
  useEffect(() => {
    if (id) {
      getDocumentbyId(id);
    }
  }, [id]);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtDocumentTypeName: Yup.string()
      .trim()
      .required('Please enter the Document Type name.')
      .matches(/^^[a-zA-Z0-9 ]+$/, 'Special Symbols Not Allowed')
  });

  return (
    <AdminDashboardPage title="Manage Document Type">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit DocumentType Name' : 'Add Document Type Name'}
          subtitle={
            id
              ? 'Please update the details below to update Document Type Name.'
              : 'Please fill the below details to create new Document Type Name.'
          }
        >
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
              isSubmitting,
              touched,
              values
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <TextInput
                    fullWidth
                    label="Document Type Name "
                    name="txtDocumentTypeName"
                    value={values.txtDocumentTypeName}
                    inputProps={{ maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(
                      touched.txtDocumentTypeName && errors.txtDocumentTypeName
                    )}
                    helperText={String(
                      touched.txtDocumentTypeName && errors.txtDocumentTypeName
                    )}
                  />
                </CardContent>
                <Divider />
                <CardActions>
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {id ? 'Update' : 'Save'}
                  </LoadingButton>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => navigate(manageDocuments)}
                  >
                    {id ? 'Cancel' : 'Back'}
                  </Button>
                </CardActions>
              </Form>
            )}
          </Formik>
        </AdminFormLayout>
      ) : (
        <Loader />
      )}
    </AdminDashboardPage>
  );
};

export default CreateDocuments;
