// src/store/messageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageDTO, MessageState } from '../types/global';
import { transformBackendMessage } from '../utils';
import { useAppSelector } from './hooks';

const initialState: MessageState = {
  messages: {},
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: (
      state,
      action: PayloadAction<{ channelId: number; messages: Message[] }>
    ) => {
      const { channelId, messages } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      const existingMessageIds = new Set(state.messages[channelId].map((msg) => msg.id));
      const newUniqueMessages = messages.filter((msg) => !existingMessageIds.has(msg.id));
      state.messages[channelId] = [...state.messages[channelId], ...newUniqueMessages];
    },
    sendMessage: (state, action: PayloadAction<Omit<Message, 'id'>>) => {
      const message: Message = {
        id: Date.now(),
        ...action.payload,
      };
      if (!state.messages[message.channelId]) {
        state.messages[message.channelId] = [];
      }
      state.messages[message.channelId].push(message);
      console.log(`Sent message to channel ${message.channelId}:`, message);
    },
    receiveMessage: (
      state,
      action: PayloadAction<{ message: any; currentId: number }>
    ) => {
      const { message: incomingDTO, currentId } = action.payload;
      const message: Message = transformBackendMessage(incomingDTO, incomingDTO.channelId);

      const channelMessages = state.messages[message.channelId] || [];

      if (message.sender && message.sender.id === currentId) {
        const pendingIndex = channelMessages.findIndex(
          (msg) =>
            msg.status === 'pending' &&
            msg.sender.id === currentId &&
            msg.content === message.content
        );
        if (pendingIndex !== -1) {
          state.messages[message.channelId][pendingIndex] = { ...message, status: 'sent' };
          console.log(`Updated pending message in channel ${message.channelId}:`, message);
          return;
        }
      }

      if (!channelMessages.some((msg) => msg.id === message.id)) {
        state.messages[message.channelId].push({ ...message, status: 'sent' });
        console.log(`Received message in channel ${message.channelId}:`, message);
      } else {
        console.warn(`Duplicate message received in channel ${message.channelId}:`, message);
      }
    },
    markMessageError: (
      state,
      action: PayloadAction<{ channelId: number; content: string; currentId: number }>
      ) => {
      const { channelId, content, currentId } = action.payload;
      const channelMessages = state.messages[channelId] || [];
      const index = channelMessages.findIndex(
        (msg) =>
          msg.status === 'pending' &&
          msg.sender.id === currentId &&
          msg.content === content
      );
      if (index !== -1) {
        state.messages[channelId][index].status = 'error';
        console.log(`Marked message as error in channel ${channelId}:`, channelMessages[index]);
      }
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const updated = action.payload;
      const channelMessages = state.messages[updated.channelId] || [];
      const index = channelMessages.findIndex((msg) => msg.id === updated.id);
      if (index !== -1) {
        state.messages[updated.channelId][index] = { ...updated, status: 'sent' };
        console.log(`Updated message in channel ${updated.channelId}:`, updated);
      }
    },
    deleteMessage: (state, action: PayloadAction<{ channelId: number; messageId: number }>) => {
      const { channelId, messageId } = action.payload;
      state.messages[channelId] = state.messages[channelId].filter((msg) => msg.id !== messageId);
      console.log(`Deleted message ${messageId} in channel ${channelId}`);
    }    
  },
  extraReducers: (builder) => {},
});

export const { addMessages, sendMessage, receiveMessage, markMessageError, updateMessage, deleteMessage } = messageSlice.actions;

export default messageSlice.reducer;
