// src/store/messageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageState, Attachment } from '../types/global';

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
      console.log(`Added ${newUniqueMessages.length} new messages to channel ${channelId}`);
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
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (!state.messages[message.channelId]?.some((msg) => msg.id === message.id)) {
        if (!state.messages[message.channelId]) {
          state.messages[message.channelId] = [];
        }
        state.messages[message.channelId].push(message);
        console.log(`Received message in channel ${message.channelId}:`, message);
      } else {
        console.warn(`Duplicate message received in channel ${message.channelId}:`, message);
      }
    },
  },
  extraReducers: (builder) => {
  },
});

export const { addMessages, sendMessage, receiveMessage } = messageSlice.actions;

export default messageSlice.reducer;
