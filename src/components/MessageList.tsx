import React, { useEffect, useRef } from 'react';
import { Box, Typography, List } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchMessages } from '../store/messageSlice';
import MessageItem from './MessageItem';
import { MessageListProps } from '../types/global';

const MessageList: React.FC<MessageListProps> = ({ selectedChannel }) => {
  const dispatch = useAppDispatch();
  
  const messages = useAppSelector((state) => state.messages.messages[selectedChannel] || []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    dispatch(fetchMessages(selectedChannel));
  }, [dispatch, selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        mb: 2,
        paddingRight: 2,
        pr: 2,
      }}
    >
      {messages.length === 0 ? (
        <Typography variant="h6">No messages in this channel.</Typography>
      ) : (
        <List>
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </List>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
