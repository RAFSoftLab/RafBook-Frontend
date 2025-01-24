import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations/animations';
import logo from '../assets/Logo.png';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const timer = setTimeout(() => {
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
      data-cy="splash-screen"
    >
      <Box
        component="img"
        src={logo}
        alt="App Logo"
        sx={{
          width: { xs: '50%', sm: '30%', md: '20%' },
          maxWidth: 300,
          mb: 4,
        }}
        data-cy="splash-logo"
      />
      <CircularProgress color="primary" size={50} data-cy="splash-spinner" />
    </motion.div>
  );
};

export default SplashScreen;
