import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  channelId: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [
    {
      id: 1,
      channelId: 1,
      sender: 'Alice',
      content: 'Hello everyone!',
      timestamp: '10:00 AM',
    },
    {
      id: 2,
      channelId: 1,
      sender: 'Bob',
      content: 'Hi Alice! Welcome to the channel.',
      timestamp: '10:05 AM',
    },
  ],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    sendMessage(state, action: PayloadAction<Omit<Message, 'id'>>) {
      const newMessage: Message = {
        id: state.messages.length + 1,
        ...action.payload,
      };
      state.messages.push(newMessage);
    },
  },
});

export const { sendMessage } = messageSlice.actions;
export default messageSlice.reducer;
