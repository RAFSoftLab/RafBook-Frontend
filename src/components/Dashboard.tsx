import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import StudyProgramSelectorModal from './StudyProgramSelectorModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/messageSlice';
import { setSelectedChannelId, getUserChannels, setSelectedStudyLevel, setSelectedStudyProgram } from '../store/channelSlice';
import { Channel, Message, Attachment, StudyLevel, StudyProgram } from '../types/global';

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const dispatch = useAppDispatch();

  const channelState = useAppSelector((state) => state.channel);
  const { studyLevels, selectedStudyLevel, selectedStudyProgram, loading, error } = channelState;

  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);
  const messages = useAppSelector((state) =>
    selectedChannelId !== null
      ? state.messages.messages[selectedChannelId] || []
      : []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getUserChannels());
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
    dispatch(setSelectedChannelId(id));
    setAttachments([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && attachments.length === 0) return;

    if (!selectedChannel || selectedChannel.type !== 'text') {
      return;
    }

    const messagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: 'You',
      type: newMessage.trim() !== '' ? 'text' : 'file',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    dispatch(sendMessage(messagePayload));
    setNewMessage('');
    setAttachments([]);
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

  const handleSendAttachments = (newAttachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
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
          >
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <>
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
              >
                <Typography variant="h6">
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
}

export default Dashboard;
