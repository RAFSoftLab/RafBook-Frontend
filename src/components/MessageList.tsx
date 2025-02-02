// src/components/MessageList.tsx

import React, { useEffect, useRef } from 'react';
import { Box, Typography, List } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import MessageItem from './MessageItem';
import { MessageListProps } from '../types/global';

const MessageList: React.FC<MessageListProps> = ({ selectedChannel }) => {
  const messages = useAppSelector((state) => state.messages.messages[selectedChannel] || []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      console.log(`Loaded ${messages.length} messages for channel ${selectedChannel}:`, messages);
    }
  }, [messages, selectedChannel]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        mb: 2,
        paddingRight: 2,
        pr: 2,
      }}
      data-cy="message-list-container"
    >
      {messages.length === 0 ? (
        <Typography variant="h6" data-cy="no-messages">
          No messages in this channel.
        </Typography>
      ) : (
        <List data-cy="message-list">
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                borderRadius: 2,
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
                mb: 1,
                paddingY: 0.5,
                paddingX: 1,
              }}
              data-cy={`message-item-${msg.id}`}
            >
              <MessageItem message={msg} />
            </Box>
          ))}
        </List>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
