// src/components/AttachmentPreview.tsx

import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getFileIcon } from '../utils';
import { AttachmentPreviewProps, Type } from '../types/global';

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemoveAttachment,
  maxVisibleImages,
}) => {
  const imageAttachments = attachments.filter(att => att.type === Type.IMAGE);
  const videoAttachments = attachments.filter(att => att.type === Type.VIDEO);
  const voiceAttachments = attachments.filter(att => att.type === Type.VOICE);
  const fileAttachments = attachments.filter(att => att.type === Type.FILE);

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
      data-cy="attachment-preview"
    >
      {(imageAttachments.length > 0 || videoAttachments.length > 0 || voiceAttachments.length > 0 || fileAttachments.length > 0) && (
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
              data-cy={`attachment-image-${attachment.id}`}
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
                data-cy={`remove-attachment-${attachment.id}`}
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
                  data-cy={`excess-images-overlay-${attachment.id}`}
                >
                  <Typography variant="h6">+{excessImageCount}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Video Attachments */}
      {videoAttachments.length > 0 && (
        <Box sx={{ mt: imageAttachments.length > 0 ? 2 : 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Videos
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {videoAttachments.map((attachment) => (
              <Box
                key={attachment.id}
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 120,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid #ccc',
                }}
                data-cy={`attachment-video-${attachment.id}`}
              >
                <video controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={attachment.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
                  data-cy={`remove-attachment-${attachment.id}`}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Voice Attachments */}
      {voiceAttachments.length > 0 && (
        <Box sx={{ mt: imageAttachments.length > 0 || videoAttachments.length > 0 ? 2 : 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Audio Files
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {voiceAttachments.map((attachment) => (
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
                data-cy={`attachment-voice-${attachment.id}`}
              >
                {/* Icon based on file type */}
                {getFileIcon(attachment.name)}
                {/* Audio Player */}
                <audio controls style={{ flexGrow: 1 }}>
                  <source src={attachment.url} />
                  Your browser does not support the audio element.
                </audio>
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
                  aria-label="Remove audio"
                  data-cy={`remove-attachment-${attachment.id}`}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* File Attachments */}
      {fileAttachments.length > 0 && (
        <Box sx={{ mt: imageAttachments.length > 0 || videoAttachments.length > 0 || voiceAttachments.length > 0 ? 2 : 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Files
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {fileAttachments.map((attachment) => (
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
                data-cy={`attachment-file-${attachment.id}`}
              >
                {/* Icon based on file type */}
                {getFileIcon(attachment.name)}
                {/* File Name */}
                <Typography variant="body2" noWrap>
                  {attachment.name}
                </Typography>
                {/* Download Link */}
                <Link href={attachment.url} download underline="hover">
                  Download
                </Link>
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
                  data-cy={`remove-attachment-${attachment.id}`}
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
