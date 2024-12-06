// src/context/AppContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import getTheme from '../theme/theme';

interface AppContextProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme: Theme = getTheme(mode);

  return (
    <AppContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </AppContext.Provider>
  );
};
