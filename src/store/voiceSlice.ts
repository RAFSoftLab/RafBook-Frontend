import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoiceState } from '../types/global';

const initialState: VoiceState = {
  isMuted: false,
  isDeafened: false,
  channelType: 'text',
  participants: [],
  isJoined: false,
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    toggleDeafen(state) {
      state.isDeafened = !state.isDeafened;
    },
    setChannelType(state, action: PayloadAction<'voice' | 'text'>) {
      state.channelType = action.payload;
      state.participants = [];
      state.isJoined = false;
    },
    joinChannel(state, action: PayloadAction<string>) {
      if (!state.participants.includes(action.payload)) {
        state.participants.push(action.payload);
      }
      state.isJoined = true;
    },
    leaveChannel(state, action: PayloadAction<string>) {
      state.participants = state.participants.filter(
        (participant) => participant !== action.payload
      );
      state.isJoined = false;
    },
    setParticipants(state, action: PayloadAction<string[]>) {
      state.participants = action.payload;
    },
  },
});

export const {
  toggleMute,
  toggleDeafen,
  setChannelType,
  joinChannel,
  leaveChannel,
  setParticipants,
} = voiceSlice.actions;
export default voiceSlice.reducer;
