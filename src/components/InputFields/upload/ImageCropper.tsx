import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';

import {
  Box,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Typography,
  useTheme,
  Button
} from '@mui/material';
import getCroppedImg from 'utility/cropImage';

// ----------------------------------------------------------------------

/**
 * Types/Interfaces
 */

interface Props {
  image: string;
  isOpenDialog: boolean;
  cropFrame?: 'rect' | 'round';
  cropSize?: any;
  aspectRatio?: any;
  onCloseDialog: (image?: Blob | null) => void;
}

// ----------------------------------------------------------------------

/**
 * Components
 */
/**
 * @return {JSX.Element}
 */
const ImageCropper: React.FC<Props> = ({
  image,
  isOpenDialog,
  cropFrame = 'rect',
  cropSize,
  aspectRatio,
  onCloseDialog
}) => {
  const theme = useTheme();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixel, setCroppedAreaPixel] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixel(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (croppedAreaPixel) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixel, 0);
        onCloseDialog(croppedImage);
        setZoom(1);
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixel, 0]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpenDialog}
      // onClose={() => onCloseDialog()}
    >
      <DialogTitle variant="h4" gutterBottom>
        Crop Image
      </DialogTitle>
      <DialogContent>
        <Card
          variant="outlined"
          sx={{
            p: 3,
            height: 250,
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: '8px'
          }}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            cropShape={cropFrame}
            cropSize={cropSize}
            aspect={
              (!aspectRatio && (cropFrame === 'round' ? 1 : 4 / 3)) ||
              aspectRatio
            }
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Card>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `solid 1px ${theme.palette.divider}`,
            paddingTop: theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
              paddingTop: theme.spacing(1),
              flexDirection: 'column'
            }
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              [theme.breakpoints.down('sm')]: {
                marginBottom: theme.spacing(1)
              }
            }}
          >
            <Typography sx={{ marginRight: 3 }}>Zoom: </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(_, changedZoom) => setZoom(Number(changedZoom))}
              style={{
                width: 200
              }}
            />
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={showCroppedImage}
            sx={{ width: 200 }}
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
