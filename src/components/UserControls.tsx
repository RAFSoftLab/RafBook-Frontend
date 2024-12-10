import React from 'react';
import { Box, Typography, IconButton, Tooltip, Avatar } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import SettingsIcon from '@mui/icons-material/Settings';

interface UserControlsProps {
    user: {
        name: string;
        avatar: string;
    };
    isMuted: boolean;
    isDeafened: boolean;
    onToggleMute: () => void;
    onToggleDeafen: () => void;
    onOpenSettings: () => void;
}

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
                gap: 1,
            }}
        >
            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={user.avatar} alt={user.name}>
                    {user.avatar === '' && user.name.charAt(0)}
                </Avatar>
                <Typography variant="body1" sx={{ ml: 1 }}>
                    {user.name}
                </Typography>
            </Box>

            {/* Voice Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Mute/Unmute Button */}
                <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                    <IconButton
                        onClick={onToggleMute}
                        color={isMuted ? 'error' : 'default'}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>

                {/* Deafen/Undeafen Button */}
                <Tooltip title={isDeafened ? 'Undeafen' : 'Deafen'}>
                    <IconButton
                        onClick={onToggleDeafen}
                        color={isDeafened ? 'error' : 'default'}
                        aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
                    >
                        {isDeafened ? <HeadsetOffIcon /> : <HeadsetIcon />} {/* Corrected icon usage */}
                    </IconButton>
                </Tooltip>

                {/* Settings Button */}
                <Tooltip title="Settings">
                    <IconButton
                        onClick={onOpenSettings}
                        color="default"
                        aria-label="Settings"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default UserControls;
