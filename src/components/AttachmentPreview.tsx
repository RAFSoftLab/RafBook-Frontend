// src/components/AttachmentPreview.tsx

import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getFileIcon } from '../utils';
import { AttachmentPreviewProps } from '../types/global';

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemoveAttachment,
  maxVisibleImages,
}) => {
  const imageAttachments = attachments.filter(att => att.type === 'image');
  const otherAttachments = attachments.filter(att => att.type !== 'image');

  const visibleImages = imageAttachments.slice(0, maxVisibleImages);
  const excessImageCount = imageAttachments.length - maxVisibleImages;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '70px',
        left: '10px',
        right: '10px',
        maxHeight: '300px',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      {imageAttachments.length > 0 && (
        <Typography variant="subtitle2" gutterBottom>
          Attachments
        </Typography>
      )}

      {/* Image Attachments */}
      {imageAttachments.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {visibleImages.map((attachment, index) => (
            <Box
              key={attachment.id}
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ccc',
              }}
            >
              <img
                src={attachment.url}
                alt={attachment.name || 'Image Attachment'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              {/* Remove Button */}
              <IconButton
                size="small"
                onClick={() => onRemoveAttachment(attachment.id)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)',
                  },
                }}
                aria-label="Remove attachment"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              {/* Overlay for excess images */}
              {index === maxVisibleImages - 1 && excessImageCount > 0 && (
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
                    fontSize: '1.2rem',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6">+{excessImageCount}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Other Attachments */}
      {otherAttachments.length > 0 && (
        <Box sx={{ mt: imageAttachments.length > 0 ? 2 : 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Files
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {otherAttachments.map((attachment) => (
              <Box
                key={attachment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {/* Icon based on file type */}
                {getFileIcon(attachment.name)}
                {/* File Name */}
                <Typography variant="body2" noWrap>
                  {attachment.name}
                </Typography>
                {/* Remove Button */}
                <IconButton
                  size="small"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.8)',
                    },
                  }}
                  aria-label="Remove file"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AttachmentPreview);
