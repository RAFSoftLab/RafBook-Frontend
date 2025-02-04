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
import { useAppDispatch } from '../store/hooks'; // <-- your typed hooks
import { getCurrentUser } from '../utils';
import { Sender } from '../types/global'; // or wherever your Sender type is
import { setUser } from '../store/userSlice';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ username, password });
      const token = response.token;

      if (token) {
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        // Now grab user data from the token:
        const currentUser: Sender = getCurrentUser();
        // E.g. decode token or fetch user details from server
        // Then convert `Sender` to your `UserState` shape

        dispatch(
          setUser({
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            avatar: '',
            // ...other fields if you have them in your store
          })
        );

        navigate('/dashboard');
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError('Login failed. Please try again.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
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
      data-cy="login-screen"
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
          data-cy="lock-icon"
        />

        <Typography
          variant="h4"
          gutterBottom
          color="text.primary"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
          data-cy="sign-in-title"
        >
          Sign In
        </Typography>

        {/* Display error if any */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} data-cy="error-message">
            {error}
          </Alert>
        )}

        <TextField
          data-cy="username-input"
          label="Username"
          fullWidth
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          data-cy="password-input"
          label="Password"
          type="password"
          fullWidth
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              data-cy="remember-me-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="Remember Me"
          sx={{ mb: 3, justifyContent: 'flex-start' }}
        />

        <Button
          data-cy="login-button"
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !username.trim() || !password.trim()}
          color="primary"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" data-cy="login-spinner" />
          ) : (
            'Login'
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          <a
            href="/forgot-password"
            style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
            data-cy="forgot-password-link"
          >
            Forgot Password?
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginScreen;
