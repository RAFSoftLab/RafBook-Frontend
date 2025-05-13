import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen, joinChannel, leaveChannel, setParticipants } from '../store/voiceSlice';
import { useSocket } from '../context/SocketContext';
import { addUserToVoiceChannel, removeUserFromVoiceChannel, getVoiceChannelUsers } from '../api/voiceChannelApi';

interface VoiceChannelProps {
  selectedChannel: string;
}

const VoiceChannel: React.FC<VoiceChannelProps> = ({ selectedChannel }) => {
  const dispatch = useAppDispatch();
  const { isMuted, isDeafened, isJoined, participants } = useAppSelector((state) => state.voice);
  const user = useAppSelector((state) => state.user);
  const { stompService } = useSocket();

  // Refs for managing the peer connection and local stream.
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  // Flag to indicate if an incoming offer has been received.
  const offerReceivedRef = useRef<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  // Ref to hold the latest participants so our subscription does not resubscribe on every update.
  const participantsRef = useRef<string[]>(participants);
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Creates the RTCPeerConnection if it does not already exist.
  const createPeerConnection = () => {
    if (peerConnectionRef.current) return;
    console.log('[VoiceChannel] Creating new peer connection.');
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('[VoiceChannel] New ICE candidate:', event.candidate);
        stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
          type: 'ICE_CANDIDATE',
          candidate: event.candidate,
          userId: user.id,
          username: user.username,
        });
      }
    };
    pc.onconnectionstatechange = () => {
      console.log('[VoiceChannel] Connection state changed:', pc.connectionState);
      setConnectionStatus(pc.connectionState);
    };
    pc.ontrack = (event) => {
      console.log('[VoiceChannel] Received remote track.');
      const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
      if (remoteAudio && event.streams && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch((err) => console.error('[VoiceChannel] Error playing remote audio:', err));
      }
    };
    peerConnectionRef.current = pc;
  };

  // Creates and sends an SDP offer if none has been received.
  const sendOffer = async () => {
    if (!offerReceivedRef.current && peerConnectionRef.current) {
      try {
        console.log('[VoiceChannel] Creating offer...');
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log('[VoiceChannel] Offer created and set locally:', offer);
        stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
          type: 'OFFER',
          sdp: offer.sdp,
          userId: user.id,
          username: user.username,
        });
      } catch (e) {
        console.error('[VoiceChannel] Error creating offer:', e);
      }
    }
  };

  // Handles incoming signaling messages.
  const handleSignalingMessage = async (msg: any) => {
    console.log('[VoiceChannel] Received signaling message:', msg);
    if (msg.userId === user.id) return; // Ignore self-messages.
    if (!peerConnectionRef.current) return;
    if (msg.type === 'OFFER') {
      if (!offerReceivedRef.current) {
        offerReceivedRef.current = true;
        console.log('[VoiceChannel] Handling incoming OFFER.');
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          console.log('[VoiceChannel] Sending answer:', answer);
          stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
            type: 'ANSWER',
            sdp: answer.sdp,
            userId: user.id,
            username: user.username,
          });
        } catch (e) {
          console.error('[VoiceChannel] Error handling offer:', e);
        }
      }
    } else if (msg.type === 'ANSWER') {
      console.log('[VoiceChannel] Handling incoming ANSWER.');
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
      } catch (e) {
        console.error('[VoiceChannel] Error setting remote description from answer:', e);
      }
    } else if (msg.type === 'ICE_CANDIDATE') {
      console.log('[VoiceChannel] Handling incoming ICE candidate.');
      if (msg.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(msg.candidate);
        } catch (e) {
          console.error('[VoiceChannel] Error adding ICE candidate:', e);
        }
      }
    } else if (msg.type === 'DISCONNECT') {
      console.log('[VoiceChannel] Received DISCONNECT message.');
      terminatePeerConnection();
    }
  };

  // Initiates the peer connection and gets the local audio-only stream.
  const initiatePeerConnection = async () => {
    console.log('[VoiceChannel] Initiating peer connection.');
    createPeerConnection();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('[VoiceChannel] Obtained local audio stream.');
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
    } catch (e) {
      console.error('[VoiceChannel] Error accessing media devices:', e);
      return;
    }
    // Wait briefly before sending the offer.
    setTimeout(() => { sendOffer(); }, 1000);
  };

  // Terminates the peer connection and sends a DISCONNECT message.
  const terminatePeerConnection = () => {
    console.log('[VoiceChannel] Terminating peer connection.');
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
      type: 'DISCONNECT',
      userId: user.id,
      username: user.username,
    });
    offerReceivedRef.current = false;
    setConnectionStatus('disconnected');
  };

  // Subscribe to WebRTC signaling messages.
  useEffect(() => {
    console.log('[VoiceChannel] Subscribing to WebRTC messages for channel:', selectedChannel);
    const rtcSubscription = stompService.subscribeToWebRTC(selectedChannel, (message) => {
      try {
        const msg = JSON.parse(message.body);
        handleSignalingMessage(msg);
      } catch (e) {
        console.error('[VoiceChannel] Error parsing RTC signaling message:', e);
      }
    });
    return () => {
      console.log('[VoiceChannel] Unsubscribing from WebRTC messages.');
      rtcSubscription.unsubscribe();
    };
  }, [selectedChannel, stompService]);

  // Subscribe to voice channel notifications (USER_JOINED/USER_LEFT events).
  useEffect(() => {
    console.log('[VoiceChannel] Subscribing to voice channel notifications for channel:', selectedChannel);
    const voiceSubscription = stompService.subscribeToVoiceChannel(selectedChannel, (message) => {
      try {
        const msg = JSON.parse(message.body);
        console.log('[VoiceChannel] Received voice channel notification:', msg);
        if (msg.event === 'USER_JOINED') {
          dispatch(setParticipants([...participantsRef.current, msg.username]));
        } else if (msg.event === 'USER_LEFT') {
          dispatch(setParticipants(participantsRef.current.filter((p: string) => p !== msg.username)));
        }
      } catch (e) {
        console.error('[VoiceChannel] Error parsing voice channel notification:', e);
      }
    });
    return () => {
      console.log('[VoiceChannel] Unsubscribing from voice channel notifications.');
      voiceSubscription.unsubscribe();
    };
  }, [selectedChannel, stompService, dispatch]);

  // Fetch the initial participant list when the component mounts.
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const users = await getVoiceChannelUsers(selectedChannel);
        console.log('[VoiceChannel] Fetched initial users:', users);
        // Assuming users is an array of objects with a "username" property.
        dispatch(setParticipants(users.map((u: any) => u.username)));
      } catch (error) {
        console.error('[VoiceChannel] Error fetching initial participants:', error);
      }
    };
    fetchParticipants();
  }, [selectedChannel, dispatch]);

  // Update local audio tracks based on mute toggle.
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      console.log('[VoiceChannel] Updated local audio tracks. Mute:', isMuted);
    }
  }, [isMuted]);

  // Handle join/leave actions with API calls integrated.
  const handleJoinLeave = async () => {
    console.log('[VoiceChannel] Toggling join/leave. Current isJoined:', isJoined);
    if (isJoined) {
      dispatch(leaveChannel(user.username));
      try {
        await removeUserFromVoiceChannel(selectedChannel);
        console.log('[VoiceChannel] Successfully removed user from voice channel.');
      } catch (error) {
        console.error('[VoiceChannel] Error during removeUserFromVoiceChannel:', error);
      }
      terminatePeerConnection();
    } else {
      dispatch(joinChannel(user.username));
      try {
        await addUserToVoiceChannel(selectedChannel);
        console.log('[VoiceChannel] Successfully added user to voice channel.');
      } catch (error) {
        console.error('[VoiceChannel] Error during addUserToVoiceChannel:', error);
      }
      initiatePeerConnection();
    }
  };

  const handleToggleMute = () => {
    console.log('[VoiceChannel] Toggling mute.');
    dispatch(toggleMute());
  };
  const handleToggleDeafen = () => {
    console.log('[VoiceChannel] Toggling deafen.');
    dispatch(toggleDeafen());
  };

  return (
    <Box sx={{ flexGrow: 1, textAlign: 'center', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Voice Channel {selectedChannel} (Status: {connectionStatus})
      </Typography>
      <Button variant="contained" color={isJoined ? 'secondary' : 'primary'} onClick={handleJoinLeave}>
        {isJoined ? 'Leave Channel' : 'Join Channel'}
      </Button>
      {isJoined && (
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
      )}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Participants</Typography>
        {participants.map((p, index) => (
          <Typography key={index}>{p}</Typography>
        ))}
      </Box>
      {/* Hidden audio element for playing remote audio */}
      <audio id="remote-audio" autoPlay style={{ display: 'none' }}></audio>
    </Box>
  );
};

export default VoiceChannel;
