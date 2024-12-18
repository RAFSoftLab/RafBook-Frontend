import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import { MessageItemProps } from '../types/global';
import ImageGrid from './ImageGrid';
import Lightbox from './Lightbox';
import FileList from './FileList';

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const theme = useTheme();

  const isOwnMessage = message.sender === 'You';

  const avatarColor = isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.grey[500];

  const messageBackground = isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.mode === 'light'
    ? theme.palette.grey[300]
    : theme.palette.grey[700];

  const messageTextColor = isOwnMessage
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary;

  const timestampOffset = theme.spacing(6);

  const imageAttachments = message.attachments?.filter(att => att.type === 'image') || [];
  const otherAttachments = message.attachments?.filter(att => att.type !== 'image') || [];

  const maxVisibleImages = 4;
  const visibleImages = imageAttachments.slice(0, maxVisibleImages);
  const excessImageCount = imageAttachments.length - maxVisibleImages;

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageAttachments.length - 1 : prevIndex - 1
    );
  }, [imageAttachments.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageAttachments.length - 1 ? 0 : prevIndex + 1
    );
  }, [imageAttachments.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxOpen) {
        if (event.key === 'ArrowLeft') {
          handlePrevImage();
        } else if (event.key === 'ArrowRight') {
          handleNextImage();
        } else if (event.key === 'Escape') {
          handleCloseLightbox();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, handlePrevImage, handleNextImage]);

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {/* Timestamp */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{
          mb: 0.5,
          ml: timestampOffset,
        }}
      >
        {message.sender} • {message.timestamp}
      </Typography>

      {/* Message and Avatar Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          maxWidth: '70%',
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor: avatarColor,
            mr: 1,
            width: 40,
            height: 40,
          }}
        >
          {message.sender.charAt(0)}
        </Avatar>

        {/* Message Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {message.type === 'text' && (
            <Box
              sx={{
                backgroundColor: messageBackground,
                color: messageTextColor,
                borderRadius: 2,
                p: 1,
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body1" component="span">
                {message.content}
              </Typography>
            </Box>
          )}
          {message.type === 'gif' && message.gifUrl && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: '300px',
                mt: 1,
              }}
            >
              <img
                src={message.gifUrl}
                alt="GIF"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          )}
          {/* Render Image Attachments */}
          {imageAttachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <ImageGrid
                imageAttachments={imageAttachments}
                maxVisibleImages={maxVisibleImages}
                onImageClick={handleImageClick}
              />
            </Box>
          )}
          {/* Render Other Attachments */}
          {otherAttachments.length > 0 && (
            <FileList
              files={otherAttachments}
              canRemove={false}
            />
          )}
        </Box>
      </Box>

      {/* Lightbox Overlay */}
      {imageAttachments.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          onClose={handleCloseLightbox}
          images={imageAttachments}
          currentIndex={currentImageIndex}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          onThumbnailClick={handleThumbnailClick}
        />
      )}
    </Box>
  );
};

export default React.memo(MessageItem);
