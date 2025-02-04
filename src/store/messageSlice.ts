// src/store/messageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageState, Attachment } from '../types/global';
import { transformBackendMessage } from '../utils';
import {jwtDecode} from 'jwt-decode';

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
    receiveMessage: (state, action: PayloadAction<Message | any>) => {
      // Assume the payload is a MessageDTO object.
      const incomingDTO = action.payload;
      // Transform the incoming message using the shared utility.
      const message: Message = transformBackendMessage(incomingDTO, incomingDTO.channelId);
    
      let currentUsername = '';
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        currentUsername = decoded.username;
      }

      const channelMessages = state.messages[message.channelId] || [];
    
      // If the message is from "You", try to match it to a pending message by comparing content.
      if (message.sender === 'You') {
        const pendingIndex = channelMessages.findIndex(
          (msg) => msg.status === 'pending' && msg.sender === 'You' && msg.content === message.content
        );
        if (pendingIndex !== -1) {
          // Replace the pending message with the confirmed one.
          state.messages[message.channelId][pendingIndex] = { ...message, status: 'sent' };
          console.log(`Updated pending message in channel ${message.channelId}:`, message);
          return;
        }
      }
    
      // If no matching pending message is found and the message is not a duplicate, add it.
      if (!channelMessages.some((msg) => msg.id === message.id)) {
        state.messages[message.channelId].push({ ...message, status: 'sent' });
        console.log(`Received message in channel ${message.channelId}:`, message);
      } else {
        console.warn(`Duplicate message received in channel ${message.channelId}:`, message);
      }
    },
    markMessageError: (
      state,
      action: PayloadAction<{ channelId: number; content: string }>
    ) => {
      const { channelId, content } = action.payload;
      const channelMessages = state.messages[channelId] || [];
      const index = channelMessages.findIndex(
        (msg) => msg.status === 'pending' && msg.sender === 'You' && msg.content === content
      );
      if (index !== -1) {
        state.messages[channelId][index].status = 'error';
        console.log(`Marked message as error in channel ${channelId}:`, channelMessages[index]);
      }
    },    
  },
  extraReducers: (builder) => {},
});

export const { addMessages, sendMessage, receiveMessage, markMessageError } = messageSlice.actions;

export default messageSlice.reducer;
