// src/store/channelSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StudyLevel, ChannelState, StudyProgram, Message, MessageDTO } from '../types/global';
import { fetchUserChannels } from '../api/channelApi';
import { addMessages } from './messageSlice';
import { AppDispatch } from './index';
import { transformBackendMessage } from '../utils';

export const fetchUserChannelsThunk = createAsyncThunk<
  StudyLevel[],
  void,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'channel/fetchUserChannels',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const studyLevels: StudyLevel[] = await fetchUserChannels();

      console.log('Fetched user channels:', studyLevels);

      studyLevels.forEach((level) => {
        level.studyPrograms.forEach((program) => {
          program.categories.forEach((category) => {
            category.textChannels.forEach((channel) => {
              if (channel.messageDTOList && channel.messageDTOList.length > 0) {
                const messages: Message[] = mapBackendMessagesToFrontend(
                  channel.messageDTOList,
                  channel.id
                );
                dispatch(addMessages({ channelId: channel.id, messages }));
              }
            });
          });
        });
      });

      return studyLevels;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const mapBackendMessagesToFrontend = (messages: MessageDTO[], channelId: number): Message[] => {
  return messages.map((msg: MessageDTO) => transformBackendMessage(msg, channelId));
};

const initialState: ChannelState = {
  selectedChannelId: null,
  prevSelectedChannelId: null,
  studyLevels: [],
  selectedStudyLevel: null,
  selectedStudyProgram: null,
  loading: false,
  error: null,
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setSelectedChannelId: (state, action: PayloadAction<number | null>) => {
      state.prevSelectedChannelId = state.selectedChannelId;
      state.selectedChannelId = action.payload;
    },
    setSelectedStudyLevel: (state, action: PayloadAction<StudyLevel>) => {
      state.selectedStudyLevel = action.payload;
    },
    setSelectedStudyProgram: (state, action: PayloadAction<StudyProgram>) => {
      state.selectedStudyProgram = action.payload;
    },
    // Add other reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChannelsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChannelsThunk.fulfilled, (state, action) => {
        state.studyLevels = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserChannelsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch channels';
      });
  },
});

export const { setSelectedChannelId, setSelectedStudyLevel, setSelectedStudyProgram } =
  channelSlice.actions;

export default channelSlice.reducer;
