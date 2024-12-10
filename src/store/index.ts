import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import messageReducer from './messageSlice';
import voiceReducer from './voiceSlice';
import userReducer from './userSlice';
import channelReducer from './channelSlice';

import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  theme: themeReducer,
  messages: messageReducer,
  voice: voiceReducer,
  user: userReducer,
  channel: channelReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
