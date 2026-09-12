/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  styled,
  IconButton
} from '@mui/material';
import { CloudUpload as UploadIcon, ClearOutlined } from '@mui/icons-material';
import { CustomField } from 'components/InputFields';
import { AddEmployeeDocumentsFormValues } from 'models/company/employee';
import { DocumentModel } from 'models/company/DocumentType';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  uploadEmployeeDocument,
  updateEmployeeDocument
  // getEmployeeDocumentDetailsByUserIdRequest
} from 'services/company/employee/documentUpload';

// Styled Components
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

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  }
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
interface DocumentState {
  file: File | null;
  preview: boolean;
  saved: boolean;
}

interface DocumentUploadStepProps {
  values: {
    documentDetails: AddEmployeeDocumentsFormValues[];
  };
  setFieldValue: (field: string, value: any) => void;
  documentTypes: DocumentModel[];
  userId: number | null;
  // errors: any;
  // touched: any;
}
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  values,
  setFieldValue,
  documentTypes,
  userId
  // errors,
  // touched
}) => {
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const [documentStates, setDocumentStates] = useState<{
    [key: number]: DocumentState;
  }>({});
  const { showSnackbar } = useSnackbarClose();

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      showSnackbar('File size should not exceed 1MB', 'error');
      return false;
    }
    return true;
  };

  const handleFileUpload = async (
    file: File,
    documentTypeId: number,
    isUpdate: boolean = false
  ): Promise<void> => {
    setUploading({ ...uploading, [documentTypeId]: true });
    // setUploading((prev) => ({ ...prev, [documentTypeId]: true }));

    try {
      const formData = new FormData();
      formData.append('employeeDocument', file);
      formData.append('documentTypeId', documentTypeId.toString());

      let response;
      // userId = 59;
      if (isUpdate && userId) {
        response = await updateEmployeeDocument(formData, userId);
      } else {
        formData.append('userId', JSON.stringify(userId || 12));
        response = await uploadEmployeeDocument(formData);
      }

      if (response.status === 200) {
        const newDocumentDetails = [...values.documentDetails];
        const index = newDocumentDetails.findIndex(
          (doc) => doc.documentTypeId === documentTypeId
        );

        if (index !== -1) {
          newDocumentDetails[index] = {
            documentTypeId,
            employeeDocument: file
          };
        } else {
          newDocumentDetails.push({ documentTypeId, employeeDocument: file });
        }

        setFieldValue('documentDetails', newDocumentDetails);
        setDocumentStates((prev) => ({
          ...prev,
          [documentTypeId]: {
            file,
            preview: false,
            saved: true
          }
        }));

        showSnackbar(
          isUpdate
            ? toastMessages.success.adminDashboard.employee
                .employeeDocumentDetailsUpdated
            : toastMessages.success.adminDashboard.employee
                .employeeDocumentDetailsSaved,
          'success'
        );
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.error('Document upload/update error:', error);
      showSnackbar(toastMessages.error.common, 'error');
    } finally {
      setUploading({ ...uploading, [documentTypeId]: false });
    }
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
            file,
            preview: true,
            saved: false
          }
        }));
      }
      event.target.value = '';
    }
  };

  const handleDelete = (documentTypeId: number): void => {
    setDocumentStates((prev) => {
      const updatedState = { ...prev };
      delete updatedState[documentTypeId];
      return updatedState;
    });

    const newDocumentDetails = values.documentDetails.filter(
      (doc) => doc.documentTypeId !== documentTypeId
    );
    setFieldValue('documentDetails', newDocumentDetails);
  };

  const renderDocumentPreview = (file: File): React.ReactNode => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="Document preview" />;
    }
    if (file.type === 'application/pdf') {
      return <iframe src={URL.createObjectURL(file)} title="PDF preview" />;
    }
    return (
      <Typography variant="body2" color="textSecondary">
        {file.name}
      </Typography>
    );
  };

  const renderUploadArea = (documentType: DocumentModel): React.ReactNode => (
    <UploadArea>
      <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      <Typography variant="subtitle1" align="center">
        {`Upload ${documentType.name}`}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ fontSize: '0.875rem' }}
      >
        Drag & Drop or choose file to upload
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ fontSize: '0.75rem' }}
      >
        Supported Files: Image,Document (Max size: 1MB)
      </Typography>
      <UploadButton
        variant="contained"
        onClick={() => {
          const fileInput = document.getElementById(
            `file-input-${documentType.id}`
          );
          if (fileInput) fileInput.click();
        }}
        disabled={uploading[documentType.id]}
      >
        Upload {documentType.name}
      </UploadButton>
    </UploadArea>
  );

  const fetchExistingDocuments = async (): Promise<void> => {
    if (userId) {
      // const response = await getEmployeeDocumentDetailsByUserIdRequest(userId);
    }

    // console.log('res is', response);
  };

  useEffect(() => {
    fetchExistingDocuments();
  }, []);

  return (
    <Box sx={{ px: 5 }}>
      <Grid container spacing={3}>
        {documentTypes.map((documentType) => {
          const documentState = documentStates[documentType.id];
          const currentDocument = values.documentDetails.find(
            (doc) => doc.documentTypeId === documentType.id
          );

          return (
            <Grid key={documentType.id} item xs={12} sm={6}>
              <CustomField
                name={`documentDetails.${documentType.id}`}
                label={documentType.name}
              >
                <UploadCard elevation={0}>
                  <CardContent>
                    {(documentState?.file ||
                      currentDocument?.employeeDocument) &&
                    !documentState?.preview ? (
                      <>
                        <DocumentPreview>
                          {renderDocumentPreview(
                            documentState?.file ||
                              (currentDocument?.employeeDocument as File)
                          )}
                        </DocumentPreview>
                        <UploadButton
                          variant="contained"
                          onClick={() => {
                            const fileInput = document.getElementById(
                              `file-input-${documentType.id}`
                            );
                            if (fileInput) fileInput.click();
                          }}
                          disabled={uploading[documentType.id]}
                        >
                          Update Document
                        </UploadButton>
                      </>
                    ) : documentState?.preview ? (
                      <>
                        <PreviewContainer>
                          <DeleteButton
                            onClick={() => handleDelete(documentType.id)}
                            size="small"
                          >
                            <ClearOutlined />
                          </DeleteButton>
                          <DocumentPreview>
                            {renderDocumentPreview(documentState.file as File)}
                          </DocumentPreview>
                        </PreviewContainer>
                        <UploadButton
                          variant="contained"
                          onClick={() =>
                            handleFileUpload(
                              documentState.file as File,
                              documentType.id,
                              !!currentDocument?.employeeDocument
                            )
                          }
                          disabled={uploading[documentType.id]}
                        >
                          Save Document
                        </UploadButton>
                      </>
                    ) : (
                      renderUploadArea(documentType)
                    )}
                    <input
                      id={`file-input-${documentType.id}`}
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={(e) => handleFileChange(e, documentType.id)}
                      style={{ display: 'none' }}
                    />
                  </CardContent>
                </UploadCard>
              </CustomField>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DocumentUploadStep;
