import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Popover,
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography as MuiTypography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { MessageItemProps } from '../types/global';
import ImageGrid from './ImageGrid';
import Lightbox from './Lightbox';
import FileList from './FileList';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import MarkdownRenderer from './MarkdownRenderer';
import { deleteMessage } from '../store/messageSlice';
import { deleteMessageBackend } from '../api/channelApi';

const isGif = (url?: string): boolean => {
  return url ? url.toLowerCase().includes('giphy') : false;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, onEditMessage }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  let maxVisibleImages = 4;
  if (isXs) maxVisibleImages = 2;
  else if (isSm) maxVisibleImages = 3;
  else if (isMd) maxVisibleImages = 4;
  else if (isLgUp) maxVisibleImages = 6;

  const user = useAppSelector((state) => state.user);
  const isOwnMessage = message.sender.id === user.id;

  const avatarColor = isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.grey[500];

  const messageTextColor = isOwnMessage
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary;

  const timestampOffset = theme.spacing(6);

  const dispatch = useAppDispatch();

  const imageAttachments = message.attachments?.filter(
    (att) => att.type === 'image'
  ) || [];
  const otherAttachments = message.attachments?.filter(
    (att) => att.type !== 'image'
  ) || [];

  const firstAttachmentUrl = message.attachments?.[0]?.url;
  const hasGifAttachment = isGif(firstAttachmentUrl);

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [contextMenu, setContextMenu] =
    useState<{ mouseX: number; mouseY: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleEdit = () => {
    handleCloseContextMenu();
    if (onEditMessage) {
      onEditMessage(message);
    }
  };

  const handleDelete = () => {
    handleCloseContextMenu();
    dispatch(deleteMessage({channelId: message.channelId, messageId: message.id}));
    deleteMessageBackend(message.id);
  }

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
    <>
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: message.status === 'pending' ? 0.5 : 1,
          border: message.status === 'error' ? '1px solid red' : 'none',
        }}
        data-cy={`message-${message.id}`}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 0.5, ml: timestampOffset }}
          data-cy={`message-timestamp-${message.id}`}
        >
          {message.sender.firstName} {message.sender.lastName} •{' '}
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          {message.edited && (
            <span style={{ fontSize: '0.75rem', fontStyle: 'italic', marginLeft: 4 }}>
              (edited)
            </span>
          )}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', maxWidth: '70%' }}>
          <Avatar
            sx={{ bgcolor: avatarColor, mr: 1, width: 40, height: 40 }}
            data-cy={`message-avatar-${message.id}`}
          >
            {message.sender.firstName.charAt(0)}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {message.type === 'text' && (
              <Box
                sx={{
                  color: messageTextColor,
                  borderRadius: 2,
                  p: 1,
                  wordBreak: 'break-word',
                }}
                data-cy={`message-content-${message.id}`}
              >
                {/* Render Markdown with custom container to reset margins */}
                <MarkdownRenderer content={message.content} />
              </Box>
            )}
            {hasGifAttachment && (
              <Box sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: '300px', mt: 1 }} data-cy={`message-gif-${message.id}`}>
                <img
                  src={firstAttachmentUrl}
                  alt="GIF"
                  style={{ width: '100%', borderRadius: '8px' }}
                  data-cy={`gif-image-${message.id}`}
                />
              </Box>
            )}
            {!hasGifAttachment && imageAttachments.length > 0 && (
              <Box sx={{ mt: 1 }} data-cy={`message-images-${message.id}`}>
                <ImageGrid
                  imageAttachments={imageAttachments}
                  maxVisibleImages={maxVisibleImages}
                  onImageClick={handleImageClick}
                />
              </Box>
            )}
            {otherAttachments.length > 0 && (
              <FileList
                files={otherAttachments}
                canRemove={false}
                data-cy={`message-files-${message.id}`}
              />
            )}
          </Box>
        </Box>
        {!hasGifAttachment && imageAttachments.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            onClose={handleCloseLightbox}
            images={imageAttachments}
            currentIndex={currentImageIndex}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            onThumbnailClick={handleThumbnailClick}
            data-cy={`lightbox-${message.id}`}
          />
        )}
      </Box>
      <Divider  sx={{ marginTop: 1 }} />
      <Popover
        open={Boolean(contextMenu)}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit" />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Edit Message
              </MuiTypography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ReplyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Reply" />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Reply to Message
              </MuiTypography>
            </MenuItem>
            <Divider variant="middle" />
            <MenuItem sx={{ color: theme.palette.error.main }} onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText primary="Delete" sx={{ color: theme.palette.error.main }} />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Del
              </MuiTypography>
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    </>
  );
};

export default React.memo(MessageItem);
