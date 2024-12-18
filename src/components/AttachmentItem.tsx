import React from 'react';
import { Box, Link, IconButton, Typography } from '@mui/material';
import { Attachment } from '../types/global';
import CloseIcon from '@mui/icons-material/Close';
import { getFileIcon } from '../utils';

interface AttachmentItemProps {
  attachment: Attachment;
  onRemove?: (id: number) => void;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment, onRemove }) => {
  const renderAttachment = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <Box
            component="img"
            src={attachment.url}
            alt={attachment.name || 'Image Attachment'}
            sx={{
              maxWidth: '100%',
              borderRadius: 2,
              mt: 1,
            }}
          />
        );
      case 'audio':
        return (
          <Box sx={{ mt: 1 }}>
            <audio controls>
              <source src={attachment.url} />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
      case 'file':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {getFileIcon(attachment.name)}
            <Link href={attachment.url} download underline="hover" sx={{ ml: 1 }}>
              {attachment.name || 'Download File'}
            </Link>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 1 }}>
      {renderAttachment()}
      {/* Conditionally render the Remove Button */}
      {onRemove && (
        <IconButton
          size="small"
          onClick={() => onRemove(attachment.id)}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
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
      )}
    </Box>
  );
};

export default React.memo(AttachmentItem);
