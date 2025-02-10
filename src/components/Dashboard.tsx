import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, IconButton, Divider } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import StudyProgramSelectorModal from './StudyProgramSelectorModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage, markMessageError, updateMessage } from '../store/messageSlice';
import {
  setSelectedChannelId,
  fetchUserChannelsThunk,
  setSelectedStudyLevel,
  setSelectedStudyProgram,
} from '../store/channelSlice';
import { Channel, Message, Attachment, StudyLevel, StudyProgram, NewMessageDTO } from '../types/global';
import { useSocket } from '../context/SocketContext';
import { sendMessage as sendMessageBackend, editMessage } from '../api/channelApi';
import { getSenderFromUser } from '../utils';
import MarkdownRenderer from './MarkdownRenderer';
import CloseIcon from '@mui/icons-material/Close';

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const dispatch = useAppDispatch();

  const channelState = useAppSelector((state) => state.channel);
  const { studyLevels, selectedStudyLevel, selectedStudyProgram, loading, error } = channelState;
  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);
  const messages = useAppSelector((state) =>
    selectedChannelId !== null ? state.messages.messages[selectedChannelId] || [] : []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stompService } = useSocket();
  const attachmentIdRef = useRef<number>(Date.now());
  const currentUser = useAppSelector((state) => state.user);
  const sender = getSenderFromUser(currentUser);

  useEffect(() => {
    dispatch(fetchUserChannelsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && studyLevels.length > 0 && !selectedStudyLevel) {
      setIsModalOpen(true);
    }
  }, [loading, studyLevels, selectedStudyLevel]);

  useEffect(() => {
    if (!loading && selectedStudyProgram) {
      selectedStudyProgram.categories.forEach((category) => {
        category.textChannels.forEach((channel) => {
          stompService?.subscribeToChannel(channel.id);
        });
      });
    }
  }, [loading, selectedStudyProgram, stompService]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditMessage = useCallback((message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  }, []);

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
    if (!selectedChannel || selectedChannel.type !== 'text') return;

    if (editingMessage) {
      const updatedMessageDTO = {
        id: editingMessage.id,
        content: newMessage.trim(),
        createdAt: editingMessage.timestamp,
        type: editingMessage.type.toUpperCase() as 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE',
        mediaUrl: attachments.length > 0 ? attachments.map((att) => att.url) : [],
        sender: editingMessage.sender,
        reactions: editingMessage.reactions,
        parentMessage:
          Array.isArray(editingMessage.parentMessage) && editingMessage.parentMessage.length === 0
            ? null
            : editingMessage.parentMessage,
        isDeleted: false,
        isEdited: true,
      };

      const updatedMessage: Message = {
        ...editingMessage,
        content: newMessage.trim(),
        attachments: attachments.length > 0 ? attachments : editingMessage.attachments,
        edited: true,
        status: 'pending',
      };

      dispatch(updateMessage(updatedMessage));
      editMessage(editingMessage.id, updatedMessageDTO);

      setEditingMessage(null);
      setNewMessage('');
      setAttachments([]);
      return;
    }

    let messageType: string = 'TEXT';
    if (attachments.length > 0) {
      messageType = attachments[0].type.toUpperCase();
    }

    const localMessagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender: sender,
      type: messageType.toLowerCase() as 'text' | 'image' | 'video' | 'voice',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      parentMessage: [],
      edited: false,
      deleted: false,
      attachments: attachments.length > 0 ? attachments : undefined,
      status: 'pending',
    };

    dispatch(sendMessage(localMessagePayload));

    const newMessageDTO: NewMessageDTO = {
      content: newMessage.trim(),
      type: messageType as 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE',
      mediaUrl: attachments.map((att) => att.url),
      parentMessage: null,
      textChannel: selectedChannel.id,
    };

    sendMessageBackend(newMessageDTO);

    setTimeout(() => {
      dispatch(markMessageError({ channelId: selectedChannel.id, content: newMessage.trim(), currentId: currentUser.id }));
    }, 5000);

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
      sender: sender,
      type: 'image',
      content: 'GIF',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      parentMessage: [],
      edited: false,
      deleted: false,
      attachments: [gifAttachment],
      status: 'pending',
    };

    dispatch(sendMessage(localMessagePayload));

    const newMessageDTO: NewMessageDTO = {
      content: 'GIF',
      type: 'IMAGE',
      mediaUrl: [gifUrl],
      parentMessage: null,
      textChannel: selectedChannel.id,
    };

    sendMessageBackend(newMessageDTO);
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

  // Memoize preview content so it does not re-render on every keystroke.
  const previewContent = useMemo(() => (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2 }}>
      <MarkdownRenderer content={newMessage} />
    </Box>
  ), [newMessage]);

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
          pt: '64px',
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        data-cy="dashboard-main"
      >
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
                  {previewMode ? (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                      {previewContent}
                    </Box>
                  ) : (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }} data-cy="message-list-container">
                      <MessageList
                        selectedChannel={selectedChannel.id}
                        key={selectedChannel.id}
                        onEditMessage={handleEditMessage}
                      />
                    </Box>
                  )}
                  {editingMessage && (
                    <Box sx={{ mb: 1 }}>
                      <Paper
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Editing: {editingMessage.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(editingMessage.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => {
                            setEditingMessage(null);
                            setNewMessage('');
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Paper>
                    </Box>
                  )}
                  <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    onSend={handleSendMessage}
                    onSendGif={handleSendGif}
                    onSendAttachments={handleSendAttachments}
                    onRemoveAttachment={handleRemoveAttachment}
                    previewMode={previewMode}
                    setPreviewMode={setPreviewMode}
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
