import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/messageSlice';

interface Channel {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [selectedTextChannel, setSelectedTextChannel] = useState<number>(1);
  const [selectedVoiceChannel, setSelectedVoiceChannel] = useState<number>(4);
  
  const [newMessage, setNewMessage] = useState('');

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages.messages);
  const channelType = useAppSelector((state) => state.voice.channelType);

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

  const allChannels: { [key: string]: Channel[] } = {
    text: textChannels,
    voice: voiceChannels,
  };

  const getSelectedChannelName = () => {
    if (channelType === 'text') {
      const channel = textChannels.find((ch) => ch.id === selectedTextChannel);
      return channel ? channel.name : '';
    } else {
      const channel = voiceChannels.find((ch) => ch.id === selectedVoiceChannel);
      return channel ? channel.name : '';
    }
  };

  const selectedChannelName = getSelectedChannelName();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChannelSelect = (id: number) => {
    if (channelType === 'text') {
      setSelectedTextChannel(id);
    } else {
      setSelectedVoiceChannel(id);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messagePayload = {
      channelId: channelType === 'text' ? selectedTextChannel : selectedVoiceChannel,
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
        selectedChannel={channelType === 'text' ? selectedTextChannel : selectedVoiceChannel}
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

        {/* Conditional Rendering Based on Channel Type */}
        {channelType === 'voice' ? (
          <VoiceChannel selectedChannel={selectedVoiceChannel} />
        ) : (
          <>
            {/* Message List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
              <MessageList selectedChannel={selectedTextChannel} />
            </Box>

            {/* Message Input */}
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSend={handleSendMessage}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
