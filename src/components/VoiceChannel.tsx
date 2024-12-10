import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen } from '../store/voiceSlice';

interface VoiceChannelProps {
  selectedChannel: number;
}

const VoiceChannel: React.FC<VoiceChannelProps> = ({ selectedChannel }) => {
  const dispatch = useAppDispatch();
  const { isMuted, isDeafened } = useAppSelector((state) => state.voice);

  const handleToggleMute = () => {
    dispatch(toggleMute());
  };

  const handleToggleDeafen = () => {
    dispatch(toggleDeafen());
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Voice Channel {selectedChannel}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
          <IconButton onClick={handleToggleMute} color={isMuted ? 'error' : 'primary'}>
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={isDeafened ? 'Undeafen' : 'Deafen'}>
          <IconButton onClick={handleToggleDeafen} color={isDeafened ? 'error' : 'primary'}>
            {isDeafened ? <HeadsetOffIcon /> : <HeadsetIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      {/* Add additional voice controls or information as needed */}
    </Box>
  );
};

export default VoiceChannel;
