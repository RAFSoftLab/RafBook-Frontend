import React, { useEffect, useRef } from 'react';
import { Box, Typography, List, Divider, useTheme } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import MessageItem from './MessageItem';
import { MessageListProps } from '../types/global';
import { groupMessages } from '../utils';

const MessageList: React.FC<MessageListProps> = ({ selectedChannel, onEditMessage, onReplyMessage }) => {
  const messages = useAppSelector((state) => state.messages.messages[selectedChannel] || []);
  const groupedMessageGroups = groupMessages(messages);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(timeout);
  }, [groupedMessageGroups]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        paddingRight: 2,
        pr: 2,
      }}
      data-cy="message-list-container"
    >
      {groupedMessageGroups.length === 0 ? (
        <Typography variant="h6" data-cy="no-messages">
          No messages in this channel.
        </Typography>
      ) : (
        <List data-cy="message-list">
          {groupedMessageGroups.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ mb: 1 }}>
              {group.map((msg, index) => (
                <Box
                  key={msg.id}
                  sx={{
                    // borderRadius: 2,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                    // py: 0.5,
                    px: 1,
                    mb: 0.5,
                  }}
                  data-cy={`message-item-${msg.id}`}
                >
                  <MessageItem
                    message={msg}
                    onEditMessage={onEditMessage}
                    onReplyMessage={onReplyMessage}
                    showMetadata={index === 0}
                  />
                </Box>
              ))}
              {/* Divider appears after the last message of each group */}
              <Divider sx={{ marginTop: 1 }} />
            </Box>
          ))}
        </List>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
