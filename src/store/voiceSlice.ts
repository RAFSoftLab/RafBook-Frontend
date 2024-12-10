import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceState {
  isMuted: boolean;
  isDeafened: boolean;
  channelType: 'voice' | 'text';
}

const initialState: VoiceState = {
  isMuted: false,
  isDeafened: false,
  channelType: 'text',
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
    },
  },
});

export const { toggleMute, toggleDeafen, setChannelType } = voiceSlice.actions;
export default voiceSlice.reducer;
