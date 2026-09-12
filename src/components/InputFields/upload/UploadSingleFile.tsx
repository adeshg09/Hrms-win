import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  SxProps,
  Typography,
  CircularProgress
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { apiBaseUrl } from 'config/config';

export const ALLOWED_FILE_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const ALLOWED_ALL_FILE_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/zip',
  'image/webp'
];

const FILE_SIZE_LIMIT = 5 * 1000000; // 5MB in bytes

interface FileUploadProps {
  name: string;
  label: string;
  file: File | string | null;
  fieldLabel?: string;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  // helperText?: string;
  formControlStyle?: SxProps;
  onFileChange?: (file: File | null) => void;
  loading?: boolean;
  maxSizeInBytes?: number;
  showRemoveButton?: boolean; // Add this
}

const styles = {
  dropZone: {
    border: '2px dashed',
    borderColor: 'divider',
    borderRadius: 1,
    height: '170px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    bgcolor: 'background.default',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'primary.main',
      bgcolor: 'action.hover'
    }
  },
  filePreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    mt: 2
  }
};

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  file,
  fieldLabel,
  size = 'medium',
  error,
  // helperText,
  formControlStyle,
  onFileChange,
  loading = false,
  maxSizeInBytes = FILE_SIZE_LIMIT,
  showRemoveButton = true
}) => {
  const [fileError, setFileError] = useState<string>();

  const validateFile = (uploadedFile: File): boolean => {
    const checkSize = uploadedFile.size < maxSizeInBytes;
    const checkType = ALLOWED_ALL_FILE_FORMATS.includes(uploadedFile.type);

    if (!checkSize) {
      setFileError('size-invalid');
      return false;
    }
    if (!checkType) {
      setFileError('type-invalid');
      return false;
    }
    setFileError('');
    return true;
  };

  const handleFileChange = (uploadedFile: File): void => {
    if (validateFile(uploadedFile)) {
      if (onFileChange) {
        onFileChange(uploadedFile);
      }
    }
  };

  const removeFile = (): void => {
    if (onFileChange) onFileChange(null);
  };

  const downloadFile = (): void => {
    if (!file) return;

    try {
      // For string URLs (from server)
      if (typeof file === 'string') {
        const fullUrl = file.startsWith('http') ? file : `${apiBaseUrl}${file}`;

        window.open(fullUrl, '_blank');
      }
      // For File objects
      else if (file instanceof File) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('File download failed. Please check the file URL.');
    }
  };

  const renderFilePreview = (): React.ReactNode => {
    if (!file) return null;

    const fileName =
      typeof file === 'string' ? file.split('/').pop() : file.name;

    return (
      <Box sx={styles.filePreview}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InsertDriveFileIcon color="primary" />
          <Typography variant="body2">{fileName}</Typography>
        </Box>
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={downloadFile}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
          {showRemoveButton && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={removeFile}
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <FormControl
      variant="standard"
      error={error}
      sx={{ display: 'flex', ...formControlStyle }}
    >
      {fieldLabel && <FormLabel>{fieldLabel}</FormLabel>}

      <Box sx={styles.dropZone}>
        {file ? (
          renderFilePreview()
        ) : (
          <>
            <Button
              variant="contained"
              component="label"
              size={size}
              disabled={loading || !!file}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              {loading ? 'Uploading...' : label}
              <input
                name={name}
                type="file"
                accept={ALLOWED_ALL_FILE_FORMATS.join(',')}
                onChange={(e) => {
                  const uploadedFile = e.target.files?.[0];
                  if (uploadedFile) {
                    handleFileChange(uploadedFile);
                  }
                }}
                hidden
              />
            </Button>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              or drag and drop file here
            </Typography>
          </>
        )}
      </Box>

      {fileError === 'size-invalid' && (
        <FormHelperText error>
          File size must be less than {maxSizeInBytes / 1000000}MB
        </FormHelperText>
      )}
      {fileError === 'type-invalid' && (
        <FormHelperText error>Unsupported file type</FormHelperText>
      )}
    </FormControl>
  );
};

export default FileUpload;
