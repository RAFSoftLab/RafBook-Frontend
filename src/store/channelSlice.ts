import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChannelState {
  channelType: 'text' | 'voice';
  selectedChannelId: number | null;
}

const initialState: ChannelState = {
  channelType: 'text',
  selectedChannelId: null,
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setChannelType(state, action: PayloadAction<'text' | 'voice'>) {
      state.channelType = action.payload;
      state.selectedChannelId = null;
    },
    setSelectedChannelId(state, action: PayloadAction<number | null>) {
      state.selectedChannelId = action.payload;
    },
  },
});

export const { setChannelType, setSelectedChannelId } = channelSlice.actions;
export default channelSlice.reducer;
