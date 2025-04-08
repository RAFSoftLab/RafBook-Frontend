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
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { MessageItemProps, Type } from '../types/global';
import ImageGrid from './ImageGrid';
import Lightbox from './Lightbox';
import FileList from './FileList';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import MarkdownRenderer from './MarkdownRenderer';
import { deleteMessage } from '../store/messageSlice';
import { deleteMessageBackend } from '../api/channelApi';
import EmojiPicker from './EmojiPicker';

const isGif = (url?: string): boolean => {
  return url ? url.toLowerCase().includes('giphy') : false;
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onEditMessage,
  onReplyMessage,
  showMetadata = true,
}) => {
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
  const isStudent = user.role.find((role) => role === "STUDENT");
  const canDelete = isOwnMessage || !isStudent;

  const avatarColor = isOwnMessage ? theme.palette.primary.main : theme.palette.grey[500];
  const messageTextColor = theme.palette.text.primary;
  const timestampOffset = theme.spacing(7);
  const replyOffset = theme.spacing(5.5);
  const dispatch = useAppDispatch();

  const imageAttachments = message.attachments?.filter((att) => att.type === Type.IMAGE) || [];
  const otherAttachments = message.attachments?.filter((att) => att.type === Type.FILE) || [];
  const firstAttachmentUrl = message.attachments?.[0]?.url;
  const hasGifAttachment = isGif(firstAttachmentUrl);

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [reactionAnchorEl, setReactionAnchorEl] = useState<HTMLElement | null>(null);
  const [reactions, setReactions] = useState<Array<{ emoji: string; count: number }>>([]);

  const parentMessageObj = useAppSelector((state) =>
    state.messages.messages[message.channelId]?.find((msg) => msg.id === message.parentMessage)
  );

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
    onEditMessage && onEditMessage(message);
  };

  const handleReply = () => {
    handleCloseContextMenu();
    onReplyMessage && onReplyMessage(message);
  };

  const handleDelete = () => {
    handleCloseContextMenu();
    dispatch(deleteMessage({ channelId: message.channelId, messageId: message.id }));
    deleteMessageBackend(message.id);
  };

  const handleReact = (event: React.MouseEvent<HTMLLIElement>) => {
    setReactionAnchorEl(event.currentTarget);
    handleCloseContextMenu();
  };

  const handleEmojiSelect = (emoji: any) => {
    console.log('Selected emoji reaction:', emoji);
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji.native);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji.native ? { ...r, count: r.count + 1 } : r
        );
      } else {
        return [...prev, { emoji: emoji.native, count: 1 }];
      }
    });
    setReactionAnchorEl(null);
  };

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
      {showMetadata && (
        <>
          {parentMessageObj && (
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                p: 1,
                mb: 0.5,
                ml: replyOffset,
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Replying to {parentMessageObj.sender.firstName} {parentMessageObj.sender.lastName} •{' '}
                {new Date(parentMessageObj.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {parentMessageObj.content.length > 255
                  ? `${parentMessageObj.content.slice(0, 252)}...`
                  : parentMessageObj.content}
              </Typography>
            </Box>
          )}
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
        </>
      )}

      <Box
        onContextMenu={handleContextMenu}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          maxWidth: '70%',
        }}
      >
        {showMetadata && (
          <Avatar
            sx={{ bgcolor: avatarColor, mr: 1, width: 40, height: 40, mt: '-16px' }}
            data-cy={`message-avatar-${message.id}`}
          >
            {message.sender.firstName.charAt(0)}
          </Avatar>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            ml: showMetadata ? 0 : theme.spacing(6),
          }}
        >
          {/* Message Content */}
          {message.type === Type.TEXT && (
            <Box
              sx={{
                color: messageTextColor,
                borderRadius: 2,
                p: 0.5,
                pl: 1,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
              data-cy={`message-content-${message.id}`}
            >
              <MarkdownRenderer content={message.content} />
            </Box>
          )}

          {/* Video Playback */}
          {message.type === Type.VIDEO && message.attachments && message.attachments.length > 0 && (
            <Box sx={{ mt: 1, pl: 1 }}>
              <video
                controls
                style={{ maxWidth: '400px', maxHeight: '600px', borderRadius: '8px' }}
              >
                <source src={message.attachments[0].url} />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}

          {/* Audio Playback */}
          {message.type === Type.VOICE && message.attachments && message.attachments.length > 0 && (
            <Box sx={{ mt: 1, pl: 1 }}>
              <audio
                controls
                style={{ maxWidth: '400px', maxHeight: '600px', borderRadius: '8px' }}
              >
                <source src={message.attachments[0].url} />
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}

          {/* GIF Image */}
          {hasGifAttachment && (
            <Box
              sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: '300px', mt: 1, pl: 1 }}
              data-cy={`message-gif-${message.id}`}
            >
              <img
                src={firstAttachmentUrl}
                alt="GIF"
                style={{ width: '100%', borderRadius: '8px' }}
                data-cy={`gif-image-${message.id}`}
              />
            </Box>
          )}

          {/* Image Grid */}
          {!hasGifAttachment && imageAttachments.length > 0 && (
            <Box sx={{ mt: 1, pl: 1 }} data-cy={`message-images-${message.id}`}>
              <ImageGrid
                imageAttachments={imageAttachments}
                maxVisibleImages={maxVisibleImages}
                onImageClick={handleImageClick}
              />
            </Box>
          )}

          {/* Other Attachments */}
          {otherAttachments.length > 0 && (
            <Box sx={{ p: 0.5, pl: 1 }}>
              <FileList
                files={otherAttachments}
                canRemove={false}
                data-cy={`message-files-${message.id}`}
              />
            </Box>
          )}

          {message.status === 'pending' && typeof message.uploadProgress === 'number' && (
            <Box sx={{ mt: 1, pl: 1 }}>
              <Typography variant="caption">
                Uploading {message.attachments?.[0]?.name || ''} {message.uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={message.uploadProgress} />
            </Box>
          )}

          {/* Reaction Bar */}
          {reactions.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {reactions.map((reaction, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.action.selected,
                    borderRadius: '16px',
                    px: 1,
                    py: 0.25,
                    mr: 0.5,
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" sx={{ mr: 0.5 }}>
                    {reaction.emoji}
                  </Typography>
                  <Typography variant="caption">{reaction.count}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Context Menu */}
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
            <MenuItem onClick={handleEdit} disabled={!isOwnMessage}>
              <ListItemIcon>
                <EditIcon
                  fontSize="small"
                  sx={{ color: isOwnMessage ? 'inherit' : theme.palette.text.disabled }}
                />
              </ListItemIcon>
              <ListItemText primary="Edit" />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Edit Message
              </MuiTypography>
            </MenuItem>
            <MenuItem onClick={handleReply}>
              <ListItemIcon>
                <ReplyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Reply" />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Reply to Message
              </MuiTypography>
            </MenuItem>
            <MenuItem onClick={handleReact}>
              <ListItemIcon>
                <EmojiEmotionsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="React" />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Add Reaction
              </MuiTypography>
            </MenuItem>
            <Divider variant="middle" />
            <MenuItem
              onClick={handleDelete}
              disabled={!canDelete}
              sx={{
                color: canDelete ? theme.palette.error.main : theme.palette.text.disabled,
              }}
            >
              <ListItemIcon>
                <DeleteIcon
                  fontSize="small"
                  sx={{
                    color: canDelete ? theme.palette.error.main : theme.palette.text.disabled,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Delete"
                sx={{
                  color: canDelete ? theme.palette.error.main : theme.palette.text.disabled,
                }}
              />
              <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                Delete Message
              </MuiTypography>
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>

      {/* EmojiPicker Popover */}
      <EmojiPicker
        open={Boolean(reactionAnchorEl)}
        anchorEl={reactionAnchorEl}
        onClose={() => setReactionAnchorEl(null)}
        onSelectEmoji={handleEmojiSelect}
      />

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
    </>
  );
};

export default React.memo(MessageItem);
