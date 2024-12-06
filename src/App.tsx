import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppProvider, useAppContext } from './context/AppContext';

const ThemeToggleButton: React.FC = () => {
  const { mode, toggleTheme } = useAppContext();

  return (
    <IconButton
      sx={{ position: 'absolute', top: 16, right: 16 }}
      onClick={toggleTheme}
      color="inherit"
    >
      {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <CssBaseline />
      <Router>
        {/* Theme Toggle Button */}
        <ThemeToggleButton />
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
    </AppProvider>
  );
};

export default App;
