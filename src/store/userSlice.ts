import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/global';

const initialState: UserState = {
  name: '',
  avatar: '',
  email: '',
  id: -1,
  role: [],
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setUserAvatar(state, action: PayloadAction<string>) {
      state.avatar = action.payload;
    },
  },
});

export const { setUser, setUserName, setUserAvatar } = userSlice.actions;
export default userSlice.reducer;
