/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  styled,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon
  // Delete as DeleteIcon
} from '@mui/icons-material';
import { CustomField } from 'components/InputFields';
import { DocumentModel } from 'models/company/DocumentType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  uploadEmployeeDocument,
  updateEmployeeDocument,
  getEmployeeDocumentDetailsByUserIdRequest,
  deleteEmployeeDocumentDetailsByUserId
} from 'services/company/employee/documentUpload';
import { getDocumentType } from 'services/company/documentType';
import SessionContext from 'context/SessionContext';
import { AdminDashboardPage } from 'components/Page';
import Loader from 'components/Loader';
import { apiBaseUrl } from 'config/config';

const UploadCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: `1px dashed ${theme.palette.divider}`,
  background: 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}));

const PreviewContainer = styled(Box)({
  position: 'relative',
  width: '100%'
});

const UploadArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  cursor: 'pointer',
  minHeight: 200,
  justifyContent: 'center',
  gap: theme.spacing(1)
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const DocumentPreview = styled(Box)({
  width: '100%',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 'none'
  }
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
});

interface DocumentState {
  file: File | null;
  preview: boolean;
  saved: boolean;
  url: string | null;
  loading: boolean;
  documentId?: number;
  timestamp?: number; // Added for forcing re-render
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

const MyDocumentDetails = ({
  isEdit,
  setShowSaveMessage,
  employeId
}: {
  isEdit?: boolean;
  setShowSaveMessage?: (value: boolean) => void;
  employeId?: number | null;
}): JSX.Element => {
  const [documentStates, setDocumentStates] = useState<{
    [key: number]: DocumentState;
  }>({});
  const [documentTypes, setDocumentTypes] = useState<DocumentModel[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { showSnackbar } = useSnackbarClose();
  const { user } = useContext(SessionContext);
  const [userId] = useState(user?.id);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      showSnackbar('File size should not exceed 1MB', 'error');
      return false;
    }
    return true;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentTypeId: number
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFileSize(file)) {
        setDocumentStates((prev) => ({
          ...prev,
          [documentTypeId]: {
            ...prev[documentTypeId],
            file,
            preview: true,
            saved: false,
            timestamp: Date.now()
          }
        }));
      }
    }
  };

  const handleDeleteClick = (index: number): void => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleClearDocument = async (): Promise<void> => {
    if (deleteIndex === null) return;

    try {
      const documentId = documentStates[deleteIndex]?.documentId;

      setDocumentStates((prev) => ({
        ...prev,
        [deleteIndex]: {
          file: null,
          preview: false,
          saved: false,
          url: null,
          loading: false,
          documentId: prev[deleteIndex]?.documentId,
          timestamp: Date.now()
        }
      }));
      console.log(documentId);
      if (documentId) {
        await deleteEmployeeDocumentDetailsByUserId(documentId);
      }

      // Reset the delete state
      setDeleteIndex(null);
      setOpenConfirm(false);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const renderDocumentPreview = (
    documentState: DocumentState,
    documentTypeId: number
  ): React.ReactNode => {
    console.log('Document Preview state', documentState);
    if (documentState.loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (documentState.file) {
      if (documentState.file.type.startsWith('image/')) {
        return (
          <img
            id={`preview-${documentTypeId}`}
            src={URL.createObjectURL(documentState.file)}
            alt="Document preview"
            key={documentState.timestamp || Date.now()}
          />
        );
      }
      if (documentState.file.type === 'application/pdf') {
        return (
          <iframe
            id={`preview-${documentTypeId}`}
            src={URL.createObjectURL(documentState.file)}
            title="PDF preview"
            key={documentState.timestamp || Date.now()}
          />
        );
      }
    }

    if (documentState.url) {
      const fullUrl = `${apiBaseUrl}${documentState.url}`;
      if (documentState.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
        return (
          <img
            id={`preview-${documentTypeId}`}
            src={`${fullUrl}?t=${documentState.timestamp || Date.now()}`}
            alt="Document preview"
            key={documentState.timestamp || Date.now()}
          />
        );
      }
      if (documentState.url.match(/\.pdf$/i)) {
        return (
          <iframe
            id={`preview-${documentTypeId}`}
            src={`${fullUrl}?t=${documentState.timestamp || Date.now()}`}
            title="PDF preview"
            key={documentState.timestamp || Date.now()}
          />
        );
      }
    }

    return null;
  };

  const renderUploadArea = (documentType: DocumentModel): React.ReactNode => {
    console.log('upload Area');
    return (
      <UploadArea>
        <UploadIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="subtitle1" align="center">
          No document uploaded
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ fontSize: '0.875rem' }}
        >
          Please upload a document to view it here
        </Typography>
      </UploadArea>
    );
  };

  const fetchExistingDocuments = async (): Promise<void> => {
    try {
      setIsInitialLoading(true);
      const userToFetch = employeId || userId;
      const response = await getEmployeeDocumentDetailsByUserIdRequest(
        userToFetch
      );
      const documents = response.employeeDocuments;
      console.log('Fetched documents:', documents);
      const newDocumentStates: { [key: number]: DocumentState } = {};

      documentTypes.forEach((type) => {
        newDocumentStates[type.id] = {
          file: null,
          preview: false,
          saved: false,
          url: null,
          loading: false,
          timestamp: Date.now()
        };
      });

      documents.forEach((doc: any) => {
        newDocumentStates[doc.document_type_id] = {
          file: null,
          preview: true,
          saved: true,
          url: doc.document_url,
          loading: false,
          documentId: doc.id,
          timestamp: Date.now()
        };
      });

      setDocumentStates(newDocumentStates);
    } catch (error) {
      console.error('Error fetching existing documents:', error);
      showSnackbar('Failed to fetch existing documents', 'error');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchDocumentTypes = async (): Promise<void> => {
    try {
      const response = await getDocumentType();
      console.log('Document Types ', response.documentTypes);
      setDocumentTypes(response.documentTypes);
    } catch (error) {
      console.error('Error fetching document types:', error);
      showSnackbar('Failed to fetch document types', 'error');
    }
    setIsInitialLoading(false);
  };

  const handleFileUpload = async (documentTypeId: number): Promise<void> => {
    const documentState = documentStates[documentTypeId];

    // If document is saved and user clicks Update Document, directly open file dialog
    if (documentState.saved && !documentState.file) {
      const fileInput = document.getElementById(`file-input-${documentTypeId}`);
      if (fileInput) fileInput.click();
      return;
    }

    // If there's no file selected, show error
    if (!documentState.file) {
      showSnackbar('Please select a file to upload', 'error');
      return;
    }

    setDocumentStates((prev) => ({
      ...prev,
      [documentTypeId]: { ...prev[documentTypeId], loading: true }
    }));

    try {
      const formData = new FormData();
      formData.append('employeeDocument', documentState.file);
      formData.append('documentTypeId', documentTypeId.toString());

      // Add userId to formData for both cases
      const userToFetchDoc = employeId || userId;
      formData.append('userId', userToFetchDoc.toString());

      let response: any;

      // If document doesn't exist (no documentId), use insert API
      if (!documentState.documentId) {
        console.log('Upload document data', formData);
        response = await uploadEmployeeDocument(formData);
        // Update the document state with the new ID from insert response
        console.log(
          'Response After Upload',
          response.data.document_url,
          response.id
        );
        if (response.status.response_code === 200) {
          setDocumentStates((prev) => ({
            ...prev,
            [documentTypeId]: {
              file: null,
              preview: true,
              saved: true,
              url: response.data.document_url, // Adjust based on your API response
              loading: false,
              documentId: response.id, // Store the new document ID
              timestamp: Date.now()
            }
          }));
        }
      } else {
        const { documentId } = documentStates[documentTypeId];
        console.log('document id to pass', documentId);
        // If document exists, use update API
        // const userToFetch = employeId || userId;
        console.log('Update document data', formData, documentTypeId);
        if (documentId !== undefined) {
          response = await updateEmployeeDocument(formData, documentId);
          console.log('document state before update', documentStates);
          if (response.status === 200) {
            setDocumentStates((prev) => ({
              ...prev,
              [documentTypeId]: {
                file: null,
                preview: true,
                saved: true,
                url: response.data.document_url,
                loading: false,
                documentId: documentState.documentId,
                timestamp: Date.now()
              }
            }));
          }
        }
      }

      console.log('documents after update', documentStates);

      showSnackbar(
        toastMessages.success.adminDashboard.employee
          .employeeDocumentDetailsUpdated,
        'success'
      );
    } catch (error) {
      console.error('Document upload/update error:', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      fetchExistingDocuments();
      setDocumentStates((prev) => ({
        ...prev,
        [documentTypeId]: { ...prev[documentTypeId], loading: false }
      }));
    }
  };

  const checkAllSaved = (): void => {
    const allSaved = Object.values(documentStates).every(
      (state) => state.saved
    );
    if (setShowSaveMessage) {
      setShowSaveMessage(allSaved);
    }
  };
  useEffect(() => {
    if (documentTypes.length > 0) {
      fetchExistingDocuments();
    }
  }, [documentTypes, userId]);

  useEffect(() => {
    fetchDocumentTypes();
    console.log('Document Types', documentTypes);
  }, []);

  useEffect(() => {
    checkAllSaved();
  }, [documentStates]);

  return (
    <>
      {isEdit ? (
        <Box sx={{ px: 5 }}>
          <Grid container spacing={3}>
            {isInitialLoading ? (
              <Grid
                container
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Loader />
              </Grid>
            ) : !documentTypes?.length ? (
              <Grid
                container
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography> No Documents Found</Typography>
              </Grid>
            ) : (
              documentTypes.map((documentType) => {
                const documentState = documentStates[documentType.id] || {
                  file: null,
                  preview: false,
                  saved: false,
                  url: null,
                  loading: false,
                  timestamp: Date.now()
                };

                return (
                  <Grid key={documentType.id} item xs={12} sm={6}>
                    <CustomField
                      name={`documentDetails.${documentType.id}`}
                      label={documentType.name}
                    >
                      <UploadCard elevation={0}>
                        <CardContent>
                          {documentState.preview || isInitialLoading ? (
                            <PreviewContainer>
                              {!isInitialLoading && (
                                <CloseButton
                                  onClick={() =>
                                    handleDeleteClick(documentType.id)
                                  }
                                  size="small"
                                >
                                  <CloseIcon />
                                </CloseButton>
                              )}
                              <DocumentPreview>
                                {renderDocumentPreview(
                                  documentState,
                                  documentType.id
                                )}
                              </DocumentPreview>
                              {!isInitialLoading && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <UploadButton
                                    variant="contained"
                                    onClick={() =>
                                      handleFileUpload(documentType.id)
                                    }
                                    disabled={documentState.loading}
                                    startIcon={<UploadIcon />}
                                  >
                                    {documentState.saved && !documentState.file
                                      ? 'Update Document'
                                      : 'Save Document'}
                                  </UploadButton>
                                </Box>
                              )}
                            </PreviewContainer>
                          ) : (
                            <Box
                              onClick={() => {
                                console.log('File upload clicked');
                                const fileInput = document.getElementById(
                                  `file-input-${documentType.id}`
                                );
                                console.log('File input:', fileInput);
                                if (fileInput) {
                                  fileInput.click();
                                }
                              }}
                            >
                              {renderUploadArea(documentType)}
                            </Box>
                          )}
                          <input
                            id={`file-input-${documentType.id}`}
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(e) =>
                              handleFileChange(e, documentType.id)
                            }
                            style={{ display: 'none' }}
                          />
                        </CardContent>
                      </UploadCard>
                    </CustomField>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      ) : (
        <AdminDashboardPage title="My Profile - Document  Details">
          <Grid container spacing={3}>
            {isInitialLoading ? (
              <Grid
                container
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Loader />
              </Grid>
            ) : (
              documentTypes.map((documentType) => {
                const documentState = documentStates[documentType.id] || {
                  file: null,
                  preview: false,
                  saved: false,
                  url: null,
                  loading: false,
                  timestamp: Date.now()
                };

                return (
                  <Grid key={documentType.id} item xs={12} sm={6}>
                    <CustomField
                      name={`documentDetails.${documentType.id}`}
                      label={documentType.name}
                    >
                      <UploadCard elevation={0}>
                        <CardContent>
                          {documentState.preview || isInitialLoading ? (
                            <PreviewContainer>
                              {!isInitialLoading && (
                                <CloseButton
                                  onClick={() =>
                                    handleDeleteClick(documentType.id)
                                  }
                                  size="small"
                                >
                                  <CloseIcon />
                                </CloseButton>
                              )}
                              <DocumentPreview>
                                {renderDocumentPreview(
                                  documentState,
                                  documentType.id
                                )}
                              </DocumentPreview>
                              {!isInitialLoading && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <UploadButton
                                    variant="contained"
                                    onClick={() =>
                                      handleFileUpload(documentType.id)
                                    }
                                    disabled={documentState.loading}
                                    startIcon={<UploadIcon />}
                                  >
                                    {documentState.saved && !documentState.file
                                      ? 'Update Document'
                                      : 'Save Document'}
                                  </UploadButton>
                                </Box>
                              )}
                            </PreviewContainer>
                          ) : (
                            <Box
                              onClick={() => {
                                const fileInput = document.getElementById(
                                  `file-input-${documentType.id}`
                                );
                                if (fileInput) fileInput.click();
                              }}
                            >
                              {renderUploadArea(documentType)}
                            </Box>
                          )}
                          <input
                            id={`file-input-${documentType.id}`}
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(e) =>
                              handleFileChange(e, documentType.id)
                            }
                            style={{ display: 'none' }}
                          />
                        </CardContent>
                      </UploadCard>
                    </CustomField>
                  </Grid>
                );
              })
            )}
          </Grid>
        </AdminDashboardPage>
      )}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleClearDocument}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyDocumentDetails;
