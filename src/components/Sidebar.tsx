import React, { useState } from 'react';
import {
    Drawer,
    Typography,
    Divider,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen } from '../store/voiceSlice';
import { setChannelType } from '../store/channelSlice';
import SettingsModal from './SettingsModal'; 

import ChannelTypeToggle from './ChannelTypeToggle';
import ChannelList from './ChannelList';
import UserControls from './UserControls';

interface Channel {
    id: number;
    name: string;
}

interface SidebarProps {
    textChannels: Channel[];
    voiceChannels: Channel[];
    selectedChannel: number | null;
    onSelectChannel: (id: number) => void;
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    textChannels,
    voiceChannels,
    selectedChannel,
    onSelectChannel,
    drawerWidth,
    mobileOpen,
    handleDrawerToggle,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user);
    const { isMuted, isDeafened } = useAppSelector((state) => state.voice);
    const channelType = useAppSelector((state) => state.channel.channelType);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleToggleMute = () => {
        dispatch(toggleMute());
    };

    const handleToggleDeafen = () => {
        dispatch(toggleDeafen());
    };

    const handleChannelTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newChannelType: 'voice' | 'text' | null
    ) => {
        if (newChannelType !== null) {
            dispatch(setChannelType(newChannelType));
        }
    };

    const handleOpenSettings = () => {
        setIsSettingsOpen(true);
    };

    const handleCloseSettings = () => {
        setIsSettingsOpen(false);
    };

    const displayedChannels = channelType === 'voice' ? voiceChannels : textChannels;

    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {/* Top Section: Channels Heading */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap component="div">
                    Channels
                </Typography>
            </Box>

            {/* Divider */}
            <Divider />

            {/* Channel Type Toggle */}
            <Box sx={{ p: 2 }}>
                <ChannelTypeToggle
                    channelType={channelType}
                    onChange={handleChannelTypeChange}
                />
            </Box>

            {/* Channel List */}
            <Box sx={{ p: 2 }}>
                <ChannelList
                    channels={displayedChannels}
                    selectedChannel={selectedChannel}
                    onSelectChannel={onSelectChannel}
                    channelType={channelType}
                />
            </Box>

            {/* Spacer to push user controls to the bottom */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Section: User Controls */}
            <Box
                sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            >
                <UserControls
                    user={user}
                    isMuted={isMuted}
                    isDeafened={isDeafened}
                    onToggleMute={handleToggleMute}
                    onToggleDeafen={handleToggleDeafen}
                    onOpenSettings={handleOpenSettings}
                />
            </Box>

            {/* Settings Modal */}
            <SettingsModal open={isSettingsOpen} onClose={handleCloseSettings} />
        </Box>
    );

    return (
        <>
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
                {drawerContent}
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
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
