// src/components/Dashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppContext } from '../context/AppContext';

interface Channel {
  id: number;
  name: string;
}

interface Message {
  id: number;
  channelId: number;
  sender: string;
  content: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      channelId: 1,
      sender: 'Alice',
      content: 'Hello everyone!',
      timestamp: '10:00 AM',
    },
    {
      id: 2,
      channelId: 1,
      sender: 'Bob',
      content: 'Hi Alice! Welcome to the channel.',
      timestamp: '10:05 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const channels: Channel[] = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Announcements' },
    { id: 3, name: 'Random' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChannelSelect = (id: number) => {
    setSelectedChannel(id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      channelId: selectedChannel,
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const drawerWidth = 240;

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Channels
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {channels.map((channel) => (
          <ListItem key={channel.id} disablePadding>
            <ListItemButton
              selected={selectedChannel === channel.id}
              onClick={() => handleChannelSelect(channel.id)}
            >
              <ListItemText primary={`# ${channel.name}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChannel]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          {/* Theme Toggle Button */}
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="channels"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar />

        {/* Channel Header */}
        <Typography variant="h5" gutterBottom>
          {channels.find((ch) => ch.id === selectedChannel)?.name}
        </Typography>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            paddingRight: 2,
            pr: 2,
          }}
        >
          {messages
            .filter((msg) => msg.channelId === selectedChannel)
            .map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {msg.sender} • {msg.timestamp}
                </Typography>
                <Box
                  sx={{
                    backgroundColor:
                      msg.sender === 'You'
                        ? theme.palette.primary.light
                        : theme.palette.grey[300],
                    color: msg.sender === 'You' ? theme.palette.primary.contrastText : 'inherit',
                    borderRadius: 2,
                    p: 1,
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>
              </Box>
            ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, height: '56px' }}
            onClick={handleSendMessage}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
