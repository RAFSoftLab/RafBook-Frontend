import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/messageSlice';
import { setSelectedChannelId, setChannels } from '../store/channelSlice';
import { Channel, Message } from '../types/global';

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');

  const dispatch = useAppDispatch();
  
  const channels = useAppSelector((state) => state.channel.channels);
  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);

  useEffect(() => {
    const initialChannels: Channel[] = [
      // Text Channels
      { id: 1, name: 'General', type: 'text' },
      { id: 2, name: 'Announcements', type: 'text' },
      { id: 3, name: 'Random', type: 'text' },
      // Voice Channels
      { id: 4, name: 'Gaming', type: 'voice' },
      { id: 5, name: 'Music', type: 'voice' },
      { id: 6, name: 'Study Group', type: 'voice' },
    ];

    dispatch(setChannels(initialChannels));
  }, [dispatch]);

  const getSelectedChannel = (): Channel | null => {
    return channels.find((ch) => ch.id === selectedChannelId) || null;
  };

  const selectedChannel = getSelectedChannel();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChannelSelect = (id: number) => {
    dispatch(setSelectedChannelId(id));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (!selectedChannel || selectedChannel.type !== 'text') {
      return;
    }

    const messagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: 'You',
      type: 'text',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(sendMessage(messagePayload));
    setNewMessage('');
  };

  const handleSendGif = (gifUrl: string) => {
    if (!selectedChannel || selectedChannel.type !== 'text') {
      return;
    }

    const messagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: 'You',
      type: 'gif',
      content: '',
      gifUrl: gifUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(sendMessage(messagePayload));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        channelName={selectedChannel ? selectedChannel.name : 'Channels'}
      />
      <Sidebar
        channels={channels}
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
        {selectedChannel ? (
          selectedChannel.type === 'voice' ? (
            <VoiceChannel selectedChannel={selectedChannel.id} />
          ) : (
            <>
              {/* Message List */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                <MessageList selectedChannel={selectedChannel.id} />
              </Box>

              {/* Message Input */}
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSend={handleSendMessage}
                onSendGif={handleSendGif}
              />
            </>
          )
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
              Please select a channel to view content.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
