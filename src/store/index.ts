import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import messageReducer from './messageSlice';
import voiceReducer from './voiceSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    messages: messageReducer,
    voice: voiceReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
