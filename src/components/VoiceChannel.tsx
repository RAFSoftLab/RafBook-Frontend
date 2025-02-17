import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  toggleMute,
  toggleDeafen,
  joinChannel,
  leaveChannel,
  setParticipants,
} from '../store/voiceSlice';
import { VoiceChannelProps } from '../types/global';

const VoiceChannel: React.FC<VoiceChannelProps> = ({ selectedChannel }) => {
  const dispatch = useAppDispatch();
  const { isMuted, isDeafened, participants, isJoined } = useAppSelector(
    (state) => state.voice
  );

  const placeholderParticipants = ['Alice', 'Bob', 'Charlie'];

  useEffect(() => {
    dispatch(setParticipants(placeholderParticipants));
  }, [dispatch, selectedChannel]);

  const handleToggleMute = () => {
    dispatch(toggleMute());
  };

  const handleToggleDeafen = () => {
    dispatch(toggleDeafen());
  };

  const handleJoinLeave = () => {
    if (isJoined) {
      dispatch(leaveChannel('You'));
    } else {
      dispatch(joinChannel('You'));
    }
  };

  return (
    <Box
      data-cy="voice-channel-component"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Typography variant="h5" gutterBottom data-cy="voice-channel-text">
        Voice Channel {selectedChannel}
      </Typography>

      {/* Join/Leave Button */}
      <Button
        variant="contained"
        color={isJoined ? 'secondary' : 'primary'}
        onClick={handleJoinLeave}
        sx={{ mb: 2 }}
      >
        {isJoined ? 'Leave Channel' : 'Join Channel'}
      </Button>

      {/* User Controls */}
      {isJoined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton
              onClick={handleToggleMute}
              color={isMuted ? 'error' : 'primary'}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isDeafened ? 'Undeafen' : 'Deafen'}>
            <IconButton
              onClick={handleToggleDeafen}
              color={isDeafened ? 'error' : 'primary'}
            >
              {isDeafened ? <HeadsetOffIcon /> : <HeadsetIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Participants List */}
      {isJoined ? (
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <Typography variant="h6" gutterBottom>
            Participants
          </Typography>
          <List>
            {participants.map((participant, index) => (
              <ListItem key={index}>
                <Avatar>{participant.charAt(0)}</Avatar>
                <ListItemText
                  primary={participant}
                  sx={{ ml: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Join the channel to see participants and interact.
        </Typography>
      )}
    </Box>
  );
};

export default VoiceChannel;
