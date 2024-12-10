import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import MessageItem from './MessageItem';

interface MessageListProps {
  selectedChannel: number;
}

const MessageList: React.FC<MessageListProps> = ({ selectedChannel }) => {
  const messages = useAppSelector((state) => state.messages.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChannel]);

  const filteredMessages = messages.filter((msg) => msg.channelId === selectedChannel);

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
      {filteredMessages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
