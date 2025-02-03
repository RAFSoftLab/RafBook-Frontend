// src/store/channelSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StudyLevel, ChannelState, StudyProgram, Message, MessageDTO, Attachment } from '../types/global';
import { fetchUserChannels } from '../api/channelApi';
import { addMessages } from './messageSlice';
import { AppDispatch } from './index';

export const fetchUserChannelsThunk = createAsyncThunk<
  StudyLevel[],
  void,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'channel/fetchUserChannels',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const studyLevels: StudyLevel[] = await fetchUserChannels();

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
  return messages.map((msg: MessageDTO) => {
    const attachments: Attachment[] =
      msg.mediaUrl && msg.mediaUrl.length > 0
        ? msg.mediaUrl.map((url: string, index: number) => ({
            id: Number(`${msg.id}${index}`),
            type: msg.type.toLowerCase() as 'image' | 'video' | 'voice' | 'file',
            url,
            name:
              msg.type === 'IMAGE'
                ? 'Image'
                : msg.type === 'VIDEO'
                ? 'Video'
                : msg.type === 'VOICE'
                ? 'Voice'
                : 'File',
          }))
        : [];

    const message: Message = {
      id: msg.id,
      channelId: channelId,
      sender: `${msg.sender.firstName} ${msg.sender.lastName}`,
      type: msg.type.toLowerCase() as 'text' | 'image' | 'video' | 'voice',
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    return message;
  });
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
