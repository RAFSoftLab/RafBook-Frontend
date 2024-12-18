import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageState } from '../types/global';

const initialState: MessageState = {
  messages: {},
};

let nextMessageId = 1;

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    sendMessage(state, action: PayloadAction<Omit<Message, 'id'>>) {
      const { channelId, sender, type, content, gifUrl, timestamp } = action.payload;
      const newMessage: Message = { id: nextMessageId++, channelId, sender, type, content, gifUrl, timestamp };
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      state.messages[channelId].push(newMessage);
    },
    fetchMessages(state, action: PayloadAction<number>) {
      // Implement fetching messages logic, possibly async
      // For now, it's a placeholder
      // e.g., state.messages[action.payload] = fetchedMessages;
    },
  },
});

export const { sendMessage, fetchMessages } = messageSlice.actions;
export default messageSlice.reducer;
