import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen, joinChannel, leaveChannel, setParticipants } from '../store/voiceSlice';
import { VoiceChannelProps } from '../types/global';
import { useSocket } from '../context/SocketContext';

const VoiceChannel: React.FC<VoiceChannelProps> = ({ selectedChannel }) => {
  const dispatch = useAppDispatch();
  const { isMuted, isDeafened, participants, isJoined } = useAppSelector((state) => state.voice);
  const user = useAppSelector((state) => state.user);
  const { stompService } = useSocket();
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  const createPeerConnection = () => {
    if (peerConnectionRef.current && peerConnectionRef.current.connectionState !== "closed") {
      return;
    }
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
          type: 'ICE_CANDIDATE',
          candidate: event.candidate,
          userId: user.id,
          username: user.username,
        });
      } else {
        console.log("All ICE candidates have been sent.");
      }
    };
  
    pc.onconnectionstatechange = () => {
      console.log("Peer connection state changed:", pc.connectionState);
      setConnectionStatus(pc.connectionState);
    };
  
    pc.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
    };
  
    pc.onnegotiationneeded = async () => {
      console.log("Negotiation needed event fired.");
    };
  
    peerConnectionRef.current = pc;
  };
  
  const initiatePeerConnection = async () => {
    console.log("Initiating peer connection...");
    
    if (!peerConnectionRef.current || peerConnectionRef.current.connectionState === "closed") {
      console.log("Creating a new peer connection because none exists or the current one is closed.");
      createPeerConnection();
    }
  
    const pc = peerConnectionRef.current;
    if (!pc || pc.connectionState === "closed") {
      console.error("Peer connection is closed before creating offer. Aborting offer creation.");
      return;
    }
  
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      console.log("Local media tracks added:", localStream.getTracks());
      
      const offer = await pc.createOffer();
      console.log("Offer created:", offer);
      
      await pc.setLocalDescription(offer);
      console.log("Local description set:", offer);
      
      stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
        type: 'OFFER',
        sdp: offer.sdp,
        userId: user.id,
        username: user.username,
      });
      console.log("Offer sent via signaling.");
    } catch (error) {
      console.error("Error during offer creation:", error);
    }
  };

  const terminatePeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      stompService.sendMessage(`/app/webrtc/${selectedChannel}`, {
        type: 'DISCONNECT',
        userId: user.id,
        username: user.username,
      });
    }
  };

  useEffect(() => {
    if (isJoined && selectedChannel) {
      console.log(`Subscribing to WebRTC signaling for channel ${selectedChannel}`);
      stompService.subscribeToWebRTC(selectedChannel);
    }
    return () => {
      console.log("Component unmounting, terminating peer connection");
      terminatePeerConnection();
    };
  }, [isJoined, selectedChannel, stompService]);
  

  const placeholderParticipants = ['Alice', 'Bob', 'Charlie'];
  useEffect(() => {
    dispatch(setParticipants(placeholderParticipants));
  }, [dispatch, selectedChannel]);

  const handleToggleMute = () => dispatch(toggleMute());
  const handleToggleDeafen = () => dispatch(toggleDeafen());
  const handleJoinLeave = () => {
    if (isJoined) {
      dispatch(leaveChannel('You'));
      terminatePeerConnection();
    } else {
      dispatch(joinChannel('You'));
      initiatePeerConnection();
    }
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
      {isJoined && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Participants</Typography>
          {participants.map((p, index) => (
            <Typography key={index}>{p}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VoiceChannel;
