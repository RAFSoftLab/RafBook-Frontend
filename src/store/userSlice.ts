import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/global';

const initialState: UserState = {
  name: 'John Doe',
  avatar: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setUserAvatar(state, action: PayloadAction<string>) {
      state.avatar = action.payload;
    },
  },
});

export const { setUserName, setUserAvatar } = userSlice.actions;
export default userSlice.reducer;
