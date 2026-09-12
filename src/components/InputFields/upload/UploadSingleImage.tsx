/**
 * Imports
 */
import { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  SxProps,
  Typography
} from '@mui/material';

/**
 * Relative Imports
 */
import { fData } from 'utility/formatNumber';
import { IMAGE_FORMATS } from 'constants/appConstant';

/**
 * Local Imports
 */
import ImageCropper from './ImageCropper';
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Types/Interfaces
 */
interface Props {
  label: string;
  file: File | string | null;
  fieldLabel?: string;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  helperText?: string;
  formControlStyle?: SxProps;
  onFileChange: (file: File) => void;
  maxSizeLimit?: number;
  cropSize?: any;
  aspectRatio?: any;
}

// ----------------------------------------------------------------------

/**
 * @return {JSX.Element}
 */
const UploadSingleImage: React.FC<Props> = ({
  label,
  file,
  fieldLabel,
  size = 'medium',
  error,
  helperText,
  formControlStyle,
  onFileChange,
  maxSizeLimit,
  cropSize,
  aspectRatio
}): JSX.Element => {
  /* Constants */
  const PHOTO_SIZE = maxSizeLimit || 1000000; // bytes

  /* States */
  const [imgError, setImgError] = useState<string>();
  // required cropper
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [preview, setPreview] = useState<string>();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  /**
   * Functions
   */
  /**
   * @return {void}
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const checkSize = uploadedFile.size < PHOTO_SIZE;
      const checkType = IMAGE_FORMATS.includes(uploadedFile.type);
      if (!checkSize) {
        setImgError('size-invalid');
      } else if (!checkType) {
        setImgError('type-invalid');
      } else {
        setImgError('');
        // To crop image
        setCurrentFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile));
        setIsOpenDialog(true);
      }
    }
  };

  /**
   * @return {void}
   */
  const handleCloseDialog = (croppedImage?: Blob | null): void => {
    if (currentFile && croppedImage && croppedImage.type.includes('image')) {
      const croppedFile = new File([croppedImage], currentFile.name, {
        lastModified: new Date().getTime(),
        type: croppedImage.type
      });
      onFileChange(croppedFile);
      setCurrentFile(null);
      setPreview('');
    }
    setIsOpenDialog(false);
  };

  return (
    <>
      <FormControl
        variant="standard"
        error={error}
        sx={{ display: 'flex', ...formControlStyle }}
      >
        <Box sx={styles.uploadImageBoxStyle}>
          <Box sx={{ mx: 0, px: 0 }}>
            {fieldLabel && (
              <FormLabel sx={styles.formLabelStyle}>{fieldLabel}</FormLabel>
            )}
            <Button variant="contained" component="label" size={size}>
              {label}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </Button>
          </Box>
          <Box sx={styles.uploadImageBoxStyle}>
            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
              {file && typeof file !== 'string' ? file.name : null}
            </Typography>
          </Box>
        </Box>

        {!(error && helperText) ? (
          <>
            {imgError === 'size-invalid' && (
              <FormHelperText error>{`File is larger than ${fData(
                PHOTO_SIZE
              )}`}</FormHelperText>
            )}

            {imgError === 'type-invalid' && (
              <FormHelperText error>
                File type must be *.jpeg, *.jpg, *.png, *.gif, *webp
              </FormHelperText>
            )}
          </>
        ) : (
          <FormHelperText error sx={{ ml: fieldLabel ? 21 : 1 }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
      {file && (
        <Box sx={{ width: 200, mt: 2 }}>
          <Box
            component="img"
            alt="file preview"
            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
            sx={{
              borderRadius: 1,
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      )}
      {preview && (
        <ImageCropper
          image={preview}
          isOpenDialog={isOpenDialog}
          cropSize={cropSize}
          aspectRatio={aspectRatio}
          onCloseDialog={handleCloseDialog}
        />
      )}
    </>
  );
};

export default UploadSingleImage;
