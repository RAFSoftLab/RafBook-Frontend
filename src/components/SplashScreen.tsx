import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations/animations';
import logo from '../assets/Logo.png';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

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
        backgroundColor: '#ffffff',
      }}
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
      />
      <CircularProgress color="primary" size={50} />
    </motion.div>
  );
};

export default SplashScreen;
