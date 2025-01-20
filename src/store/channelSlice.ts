import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudyLevel, StudyProgram } from '../types/global';
import { fetchUserChannels } from '../api/channelApi';

interface ChannelState {
    selectedChannelId: number | null;
    studyLevels: StudyLevel[];
    selectedStudyLevel: StudyLevel | null;
    selectedStudyProgram: StudyProgram | null;
    loading: boolean;
    error: string | null;
}

const initialState: ChannelState = {
    selectedChannelId: null,
    studyLevels: [],
    selectedStudyLevel: null,
    selectedStudyProgram: null,
    loading: false,
    error: null,
};

export const getUserChannels = createAsyncThunk(
    'channels/getUserChannels',
    async (_, thunkAPI) => {
        try {
            const studyLevels = await fetchUserChannels();
            return studyLevels;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setSelectedChannelId(state, action: PayloadAction<number | null>) {
            state.selectedChannelId = action.payload;
        },
        setSelectedStudyLevel(state, action: PayloadAction<StudyLevel | null>) {
            state.selectedStudyLevel = action.payload;
            state.selectedStudyProgram = null;
            state.selectedChannelId = null;
        },
        setSelectedStudyProgram(state, action: PayloadAction<StudyProgram | null>) {
            state.selectedStudyProgram = action.payload;
            state.selectedChannelId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserChannels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserChannels.fulfilled, (state, action: PayloadAction<StudyLevel[]>) => {
                state.loading = false;
                state.studyLevels = action.payload;
            })
            .addCase(getUserChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedChannelId, setSelectedStudyLevel, setSelectedStudyProgram } = channelSlice.actions;
export default channelSlice.reducer;
