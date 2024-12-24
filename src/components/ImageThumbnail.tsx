import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Attachment } from '../types/global';

interface ImageThumbnailProps {
  attachment: Attachment;
  onClick: () => void;
  showOverlay?: boolean;
  overlayCount?: number;
  onRemove?: () => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  attachment,
  onClick,
  showOverlay = false,
  overlayCount = 0,
  onRemove,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid #ccc',
        cursor: 'pointer',
        aspectRatio: '1 / 1',
      }}
      onClick={onClick}
    >
      <img
        src={attachment.url}
        alt={attachment.name || 'Image Attachment'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading="lazy"
      />
      {/* Remove Button (conditionally rendered) */}
      {onRemove && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
            },
          }}
          aria-label="Remove attachment"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      {/* Overlay for excess images */}
      {showOverlay && overlayCount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          <Typography variant="h5">+{overlayCount}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ImageThumbnail);
