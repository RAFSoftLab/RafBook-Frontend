import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/messageSlice';
import { setSelectedChannelId } from '../store/channelSlice';

interface Channel {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages.messages);
  
  const channelType = useAppSelector((state) => state.channel.channelType);
  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);

  const textChannels: Channel[] = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Announcements' },
    { id: 3, name: 'Random' },
  ];

  const voiceChannels: Channel[] = [
    { id: 4, name: 'Gaming' },
    { id: 5, name: 'Music' },
    { id: 6, name: 'Study Group' },
  ];

  const getSelectedChannelName = () => {
    if (channelType === 'text') {
      const channel = textChannels.find((ch) => ch.id === selectedChannelId);
      return channel ? channel.name : '';
    } else if (channelType === 'voice') {
      const channel = voiceChannels.find((ch) => ch.id === selectedChannelId);
      return channel ? channel.name : '';
    } else {
      return '';
    }
  };

  const selectedChannelName = getSelectedChannelName();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChannelSelect = (id: number) => {
    dispatch(setSelectedChannelId(id));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (channelType !== 'text' || selectedChannelId === null) {
      return;
    }

    const messagePayload = {
      channelId: selectedChannelId,
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(sendMessage(messagePayload));
    setNewMessage('');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        channelName={selectedChannelName}
      />
      <Sidebar
        textChannels={textChannels}
        voiceChannels={voiceChannels}
        selectedChannel={selectedChannelId}
        onSelectChannel={handleChannelSelect}
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Spacer for the AppBar */}
        <Box sx={{ height: '64px' }} />

        {/* Conditional Rendering Based on Channel Type and Selection */}
        {channelType === 'voice' ? (
          selectedChannelId ? (
            <VoiceChannel selectedChannel={selectedChannelId} />
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">
                Please select a voice channel to view participants.
              </Typography>
            </Box>
          )
        ) : channelType === 'text' ? (
          selectedChannelId ? (
            <>
              {/* Message List */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                <MessageList selectedChannel={selectedChannelId} />
              </Box>

              {/* Message Input */}
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">
                Please select a text channel to view messages.
              </Typography>
            </Box>
          )
        ) : null}
      </Box>
    </Box>
  );
};

export default Dashboard;
