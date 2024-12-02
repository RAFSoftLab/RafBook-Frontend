import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  useTheme,
  TextField,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../animations/animations';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '../api/authApi';

declare global {
  interface Window {
    api: {
      getToken: () => string | undefined;
      setToken: (token: string) => void;
      removeToken: () => void;
    };
  }
}

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ username, password });
      const token = response.token;

      if (token) {
        window.api.setToken(token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: 2,
        backgroundImage:
          theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.primary.light} 25%, ${theme.palette.secondary.light} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.dark} 25%, ${theme.palette.secondary.dark} 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor:
            theme.palette.mode === 'light'
              ? 'rgba(233, 233, 233, 0.9)'
              : 'rgba(32, 32, 32, 0.9)',
          padding: { xs: 4, sm: 6 },
          borderRadius: 3,
          boxShadow: 10,
          width: { xs: '100%', sm: 450 },
          maxWidth: '95%',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo or Icon */}
        <LockOutlinedIcon
          sx={{
            fontSize: 60,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          gutterBottom
          color="text.primary"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="Remember Me"
          sx={{ mb: 3, justifyContent: 'flex-start' }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          color="primary"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Login'
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          <a href="/forgot-password" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
            Forgot Password?
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginScreen;
