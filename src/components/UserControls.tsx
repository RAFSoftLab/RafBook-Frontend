import React from 'react';
import { Box, Typography, IconButton, Tooltip, Avatar } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserControlsProps } from '../types/global';

const UserControls: React.FC<UserControlsProps> = ({
    user,
    isMuted,
    isDeafened,
    onToggleMute,
    onToggleDeafen,
    onOpenSettings,
  }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* User Info at the "top" */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={user.avatar} alt={user.name}>
            {user.avatar === '' && user.name.charAt(0)}
          </Avatar>
          <Typography variant="body1" sx={{ ml: 1 }}>
            {user.name}
          </Typography>
        </Box>
  
        {/* Flexible spacer pushes controls to the bottom */}
        <Box sx={{ flexGrow: 1 }} />
  
        {/* Voice Controls row at the "bottom" */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton
              onClick={onToggleMute}
              color={isMuted ? 'error' : 'default'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              data-cy="mute-button"
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
  
          <Tooltip title={isDeafened ? 'Undeafen' : 'Deafen'}>
            <IconButton
              onClick={onToggleDeafen}
              color={isDeafened ? 'error' : 'default'}
              aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
              data-cy="deafen-button"
            >
              {isDeafened ? <HeadsetOffIcon /> : <HeadsetIcon />}
            </IconButton>
          </Tooltip>
  
          <Tooltip title="Settings">
            <IconButton
              onClick={onOpenSettings}
              color="default"
              aria-label="Settings"
              data-cy="settings-button"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };
  
  export default UserControls;
  
