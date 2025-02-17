import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/SocketContext';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
