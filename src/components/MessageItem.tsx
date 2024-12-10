import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const theme = useTheme();
  const isOwnMessage = message.sender === 'You';

  const avatarColor = isOwnMessage ? deepPurple[500] : deepOrange[500];

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        sx={{
          bgcolor: avatarColor,
          mr: isOwnMessage ? 0 : 1,
          ml: isOwnMessage ? 1 : 0,
        }}
      >
        {message.sender.charAt(0)}
      </Avatar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
          maxWidth: '70%',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {message.sender} • {message.timestamp}
        </Typography>
        <Box
          sx={{
            backgroundColor: isOwnMessage
              ? theme.palette.primary.light
              : theme.palette.grey[300],
            color: isOwnMessage ? theme.palette.primary.contrastText : 'inherit',
            borderRadius: 2,
            p: 1,
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MessageItem);
