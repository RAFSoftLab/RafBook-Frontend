// src/components/Dashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import StudyProgramSelectorModal from './StudyProgramSelectorModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/messageSlice';
import {
  setSelectedChannelId,
  fetchUserChannelsThunk,
  setSelectedStudyLevel,
  setSelectedStudyProgram,
} from '../store/channelSlice';
import { Channel, Message, Attachment, StudyLevel, StudyProgram } from '../types/global';
import { useSocket } from '../context/SocketContext';

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const dispatch = useAppDispatch();

  const channelState = useAppSelector((state) => state.channel);
  const { studyLevels, selectedStudyLevel, selectedStudyProgram, loading, error } = channelState;

  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);
  const prevSelectedChannelId = useAppSelector((state) => state.channel.prevSelectedChannelId);
  const messages = useAppSelector((state) =>
    selectedChannelId !== null ? state.messages.messages[selectedChannelId] || [] : []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stompService } = useSocket();

  const attachmentIdRef = useRef<number>(Date.now());

  useEffect(() => {
    dispatch(fetchUserChannelsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && studyLevels.length > 0 && !selectedStudyLevel) {
      setIsModalOpen(true);
    }
  }, [loading, studyLevels, selectedStudyLevel]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelection = (studyLevel: StudyLevel, studyProgram: StudyProgram) => {
    dispatch(setSelectedStudyLevel(studyLevel));
    dispatch(setSelectedStudyProgram(studyProgram));
  };

  const getSelectedChannel = (): Channel | null => {
    if (!selectedStudyProgram) return null;
    for (const category of selectedStudyProgram.categories) {
      const channel = category.textChannels.find((ch) => ch.id === selectedChannelId);
      if (channel) return channel;
    }
    return null;
  };

  const selectedChannel = getSelectedChannel();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChannelSelect = (id: number) => {
    if (prevSelectedChannelId !== null && stompService) {
      stompService.unsubscribeFromChannel(prevSelectedChannelId);
    }

    dispatch(setSelectedChannelId(id));
    setAttachments([]);

    stompService?.subscribeToChannel(id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && attachments.length === 0) return;
    if (!selectedChannel || selectedChannel.type !== 'text') return;
  
    let messageType: string = 'TEXT';
    if (attachments.length > 0) {
      messageType = attachments[0].type.toUpperCase();
    }
  
    const localMessagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: 'You',
      type: messageType.toLowerCase() as 'text' | 'image' | 'video' | 'voice',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? attachments : undefined,
    };
  
    dispatch(sendMessage(localMessagePayload));
  
    const newMessageDTO = {
      content: newMessage.trim(),
      type: messageType,
      mediaUrl: attachments.map((att) => att.url),
      parentMessage: null,
      textChannel: selectedChannel.id,
    };
  
    stompService?.sendMessage('/app/sendMessage', newMessageDTO);
  
    setNewMessage('');
    setAttachments([]);
  };

  const handleSendGif = (gifUrl: string) => {
    if (!selectedChannel || selectedChannel.type !== 'text') return;
  
    const gifAttachment: Attachment = {
      id: attachmentIdRef.current++,
      type: 'image',
      url: gifUrl,
      name: 'GIF',
    };
  
    const localMessagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: 'You',
      type: 'image',
      content: 'GIF',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [gifAttachment],
    };
  
    dispatch(sendMessage(localMessagePayload));
  
    const newMessageDTO = {
      content: 'GIF',
      type: 'IMAGE',
      mediaUrl: [gifUrl],
      parentMessage: null,
      textChannel: selectedChannel.id,
    };

    stompService?.sendMessage('/app/sendMessage', newMessageDTO);
    setAttachments([]);
  };

  const handleSendAttachments = (newAttachments: Attachment[]) => {
    const attachmentsWithNumericIds = newAttachments.map((att) => ({
      ...att,
      id: attachmentIdRef.current++,
    }));
    setAttachments((prev) => [...prev, ...attachmentsWithNumericIds]);
  };

  const handleRemoveAttachment = (id: number) => {
    const attachmentToRemove = attachments.find((att) => att.id === id);
    if (attachmentToRemove && attachmentToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  useEffect(() => {
    return () => {
      if (selectedChannelId !== null && stompService) {
        stompService.unsubscribeFromChannel(selectedChannelId);
      }
    };
  }, [selectedChannelId, stompService]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }} data-cy="dashboard-container">
      <Header
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        channelName={selectedChannel ? selectedChannel.description : 'Channel Description'}
      />
      <Sidebar
        studyLevels={studyLevels}
        selectedStudyLevel={selectedStudyLevel}
        selectedStudyProgram={selectedStudyProgram}
        onSelectStudyLevel={(studyLevel) => {
          dispatch(setSelectedStudyLevel(studyLevel));
          setIsModalOpen(true);
        }}
        onSelectStudyProgram={(studyProgram) => {
          dispatch(setSelectedStudyProgram(studyProgram));
        }}
        onSelectChannel={handleChannelSelect}
        selectedChannelId={selectedChannelId}
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
          position: 'relative',
        }}
        data-cy="dashboard-main"
      >
        {/* Spacer for the AppBar */}
        <Box sx={{ height: '64px' }} />

        {/* Conditional Rendering Based on Channel Type and Selection */}
        {loading ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              flexDirection: 'column',
            }}
            data-cy="loading-indicator"
          >
            <CircularProgress data-cy="loading-spinner" />
            <Typography variant="h6" sx={{ mt: 2 }} data-cy="loading-text">
              Loading channels...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            data-cy="error-indicator"
          >
            <Alert severity="error" data-cy="error-message">
              {error}
            </Alert>
          </Box>
        ) : (
          <>
            {selectedChannel ? (
              selectedChannel.type === 'voice' ? (
                <VoiceChannel selectedChannel={selectedChannel.id} data-cy="voice-channel-component" />
              ) : (
                <>
                  {/* Message List */}
                  <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }} data-cy="message-list-container">
                    <MessageList selectedChannel={selectedChannel.id} key={selectedChannel.id} />
                  </Box>

                  {/* Message Input */}
                  <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    onSend={handleSendMessage}
                    onSendGif={handleSendGif}
                    onSendAttachments={handleSendAttachments}
                    onRemoveAttachment={handleRemoveAttachment}
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
                data-cy="no-channel-selected"
              >
                <Typography variant="h6" data-cy="no-channel-text">
                  Please select a channel to view content.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Selection Modal */}
        <StudyProgramSelectorModal
          open={isModalOpen}
          studyLevels={studyLevels}
          onClose={handleCloseModal}
          onSelect={handleSelection}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
