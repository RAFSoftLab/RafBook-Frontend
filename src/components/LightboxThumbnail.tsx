import React from 'react';
import { Box } from '@mui/material';
import { Attachment } from '../types/global';

interface LightboxThumbnailProps {
  attachment: Attachment;
  isActive: boolean;
  onClick: () => void;
}

const LightboxThumbnail: React.FC<LightboxThumbnailProps> = ({
  attachment,
  isActive,
  onClick,
}) => {
  return (
    <Box
      sx={{
        flex: '0 0 auto',
        width: 60,
        height: 60,
        mr: 1,
        border: isActive ? '2px solid white' : '2px solid transparent',
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={onClick}
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
  );
};

export default React.memo(LightboxThumbnail);
