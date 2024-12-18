import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Attachment } from '../types/global';

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  images: Attachment[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onThumbnailClick: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
  onThumbnailClick,
}) => {
  const theme = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open) {
        if (event.key === 'ArrowLeft') {
          onPrev();
        } else if (event.key === 'ArrowRight') {
          onNext();
        } else if (event.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onPrev, onNext, onClose]);

  if (!images[currentIndex]) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { 
          backgroundColor: theme.palette.background.default,
          boxShadow: 'none' 
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: theme.palette.text.primary,
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* Dialog Content */}
      <DialogContent
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          padding: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Previous Arrow */}
        {images.length > 1 && (
          <IconButton
            aria-label="previous image"
            onClick={onPrev}
            sx={{
              position: 'absolute',
              left: 16,
              color: theme.palette.text.primary,
            }}
          >
            <ArrowBackIos />
          </IconButton>
        )}
        {/* Current Image */}
        <Box
          component="img"
          src={images[currentIndex].url}
          alt={images[currentIndex].name || 'Image Attachment'}
          sx={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: 1,
            boxShadow: 3,
          }}
        />
        {/* Next Arrow */}
        {images.length > 1 && (
          <IconButton
            aria-label="next image"
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 16,
              color: theme.palette.text.primary,
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        )}
      </DialogContent>
      {/* Thumbnail Bar */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          p: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {images.map((attachment, index) => (
          <Box
            key={attachment.id}
            sx={{
              flex: '0 0 auto',
              width: 60,
              height: 60,
              mr: 1,
              border:
                index === currentIndex
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
              borderRadius: 1,
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => onThumbnailClick(index)}
          >
            <img
              src={attachment.url}
              alt={attachment.name || 'Image Attachment'}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </Box>
    </Dialog>
  );
};

export default React.memo(Lightbox);
