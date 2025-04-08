import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, IconButton } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import VoiceChannel from './VoiceChannel';
import StudyProgramSelectorModal from './StudyProgramSelectorModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage, markMessageError, updateMessage, updateUploadProgress, deleteMessage, deleteMessagePermanently } from '../store/messageSlice';
import { setSelectedChannelId, fetchUserChannelsThunk, setSelectedStudyLevel, setSelectedStudyProgram } from '../store/channelSlice';
import { Channel, Message, Attachment, NewMessageDTO, Type } from '../types/global';
import { useSocket } from '../context/SocketContext';
import { sendMessage as sendMessageBackend, editMessage, uploadFileMessage } from '../api/channelApi';
import { getSenderFromUser } from '../utils';
import CloseIcon from '@mui/icons-material/Close';

interface MessageActionPopupProps {
  actionLabel: string;
  message: Message;
  onCancel: () => void;
}

const MessageActionPopup: React.FC<MessageActionPopupProps> = ({ actionLabel, message, onCancel }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 110,
        left: 8,
        right: 8,
        zIndex: 10,
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {actionLabel}: {message.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {message.sender.firstName} {message.sender.lastName}
          </Typography>
        </Box>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const drawerWidth = 240;
  const dispatch = useAppDispatch();
  const { studyLevels, selectedStudyLevel, selectedStudyProgram, loading, error } = useAppSelector((state) => state.channel);
  const selectedChannelId = useAppSelector((state) => state.channel.selectedChannelId);
  const { stompService } = useSocket();
  const currentUser = useAppSelector((state) => state.user);
  const sender = getSenderFromUser(currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);

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

  const getSelectedChannel = (): Channel | null => {
    if (!selectedStudyProgram) return null;
    for (const category of selectedStudyProgram.categories) {
      const textChannel = category.textChannels.find((ch) => ch.id === selectedChannelId);
      if (textChannel) return textChannel;
      const voiceChannel = category.voiceChannels.find((ch) => ch.id === selectedChannelId);
      if (voiceChannel) return voiceChannel;
    }
    return null;
  };
  
  const selectedChannel = getSelectedChannel();

  const handleChannelSelect = (id: number) => {
    dispatch(setSelectedChannelId(id));
  };

  const handleSendMessage = (content: string, attachments: Attachment[]) => {
    if (content.trim() === '' && attachments.length === 0) return;
    if (!selectedChannel || selectedChannel.type !== 'text') return;
  
    const parentMessageId = replyingMessage ? replyingMessage.id : null;
  
    if (editingMessage) {
      const updatedMessageDTO = {
        id: editingMessage.id,
        content: content.trim(),
        createdAt: editingMessage.timestamp,
        type: editingMessage.type.toUpperCase() as Type,
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
        content: content.trim(),
        attachments: attachments.length > 0 ? attachments : editingMessage.attachments,
        edited: true,
        status: 'pending',
      };
  
      dispatch(updateMessage(updatedMessage));
      editMessage(editingMessage.id, updatedMessageDTO);
  
      setEditingMessage(null);
      setReplyingMessage(null);
      return;
    }
  
    if (content.trim() !== '') {
      const textMessagePayload: Omit<Message, 'id'> = {
        channelId: selectedChannel.id,
        sender,
        type: Type.TEXT,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        reactions: [],
        parentMessage: parentMessageId,
        edited: false,
        deleted: false,
        attachments: undefined,
        status: 'pending',
      };
  
      dispatch(sendMessage(textMessagePayload));
  
      const newTextMessageDTO: NewMessageDTO = {
        content: content.trim(),
        type: Type.TEXT,
        mediaUrl: null,
        parentMessage: parentMessageId,
        textChannel: selectedChannel.id,
      };
  
      sendMessageBackend(newTextMessageDTO);
  
      setTimeout(() => {
        dispatch(
          markMessageError({
            channelId: selectedChannel.id,
            content: content.trim(),
            currentId: currentUser.id,
          })
        );
      }, 5000);
    }
  
    if (attachments.length > 0) {
      attachments.forEach((attachment) => {
        if (attachment.file) {
          const tempId = Date.now() + Math.random();
    
          const { file, ...cleanAttachment } = attachment;
    
          const attachmentMessagePayload: Omit<Message, 'id'> & { tempId: number; uploadProgress: number } = {
            channelId: selectedChannel.id,
            sender,
            type: attachment.type as Type,
            content: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: [],
            parentMessage: parentMessageId,
            edited: false,
            deleted: false,
            attachments: [{ ...cleanAttachment }],
            status: 'pending',
            tempId,
            uploadProgress: 0,
          };
    
          dispatch(sendMessage(attachmentMessagePayload));
    
          uploadFileMessage(
            attachment.file,
            selectedChannel.id,
            attachment.type,
            parentMessageId ?? undefined,
            (progress: number) => {
              dispatch(updateUploadProgress({ tempId, progress }));
            }
          )
            .then((response) => {
              dispatch(deleteMessagePermanently({ channelId: selectedChannel.id, messageId: tempId }));
            })
            .catch(() => {
              dispatch(
                markMessageError({
                  channelId: selectedChannel.id,
                  content: '',
                  currentId: currentUser.id,
                })
              );
            });
        }
      });
    }    
        
  
    setReplyingMessage(null);
  };  

  const handleSendGif = (gifUrl: string) => {
    if (!selectedChannel || selectedChannel.type !== 'text') return;

    const gifAttachment: Attachment = {
      id: Date.now(),
      type: Type.IMAGE,
      url: gifUrl,
      name: 'GIF',
    };

    const parentMessageId = replyingMessage ? replyingMessage.id : null;

    const localMessagePayload: Omit<Message, 'id'> = {
      channelId: selectedChannel.id,
      sender,
      type: Type.IMAGE,
      content: 'GIF',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      parentMessage: parentMessageId,
      edited: false,
      deleted: false,
      attachments: [gifAttachment],
      status: 'pending',
    };

    dispatch(sendMessage(localMessagePayload));

    const newMessageDTO: NewMessageDTO = {
      content: 'GIF',
      type: Type.IMAGE,
      mediaUrl: gifUrl,
      parentMessage: parentMessageId,
      textChannel: selectedChannel.id,
    };

    sendMessageBackend(newMessageDTO);
    setReplyingMessage(null);
  };

  const handleSendAttachments = (newAttachments: Attachment[]) => {
    // Optional
  };

  const handleRemoveAttachment = (id: number) => {
    // Optional
  };

  const handleEditMessage = useCallback((message: Message) => {
    setEditingMessage(message);
    setReplyingMessage(null);
  }, []);

  const handleReplyMessage = useCallback((message: Message) => {
    setReplyingMessage(message);
    setEditingMessage(null);
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }} data-cy="dashboard-container">
      <Header
        drawerWidth={drawerWidth}
        handleDrawerToggle={() => {}}
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
        mobileOpen={false}
        handleDrawerToggle={() => {}}
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
        ) : selectedChannel ? (
          selectedChannel.type === 'voice' ? (
            <VoiceChannel selectedChannel={selectedChannel.id} data-cy="voice-channel-component" />
          ) : (
            <>
              <MessageList
                selectedChannel={selectedChannel.id}
                onEditMessage={handleEditMessage}
                onReplyMessage={handleReplyMessage}
              />
              {editingMessage && (
                <MessageActionPopup
                  actionLabel="Editing"
                  message={editingMessage}
                  onCancel={() => setEditingMessage(null)}
                />
              )}
              {replyingMessage && (
                <MessageActionPopup
                  actionLabel="Replying"
                  message={replyingMessage}
                  onCancel={() => setReplyingMessage(null)}
                />
              )}
              <MessageInput
                editingContent={editingMessage ? editingMessage.content : undefined}
                onSend={handleSendMessage}
                onSendGif={handleSendGif}
                onSendAttachments={handleSendAttachments}
                onRemoveAttachment={handleRemoveAttachment}
                autoFocus={Boolean(editingMessage || replyingMessage)}
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
        <StudyProgramSelectorModal
          open={isModalOpen}
          studyLevels={studyLevels}
          onClose={() => setIsModalOpen(false)}
          onSelect={(studyLevel, studyProgram) => {
            dispatch(setSelectedStudyLevel(studyLevel));
            dispatch(setSelectedStudyProgram(studyProgram));
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
