import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel, ChannelState } from '../types/global';

const initialState: ChannelState = {
  selectedChannelId: null,
  channels: [],
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setSelectedChannelId(state, action: PayloadAction<number>) {
      state.selectedChannelId = action.payload;
    },
    setChannels(state, action: PayloadAction<Channel[]>) {
      state.channels = action.payload;
    },
  },
});

export const { setSelectedChannelId, setChannels } = channelSlice.actions;
export default channelSlice.reducer;
