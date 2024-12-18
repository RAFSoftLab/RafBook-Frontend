import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { MessageItemProps, Attachment } from '../types/global';
import AttachmentItem from './AttachmentItem';

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
          {/* Render Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {message.attachments.map((attachment: Attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MessageItem);
