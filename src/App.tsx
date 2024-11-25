import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme/theme';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = getTheme(mode);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Theme Toggle Button */}
        <IconButton
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={toggleTheme}
          color="inherit"
        >
          {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
};

export default App;
