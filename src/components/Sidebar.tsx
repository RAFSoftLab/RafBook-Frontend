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
import SettingsModal from './SettingsModal'; 
import ChannelList from './ChannelList';
import UserControls from './UserControls';
import { SidebarProps } from '../types/global';

const Sidebar: React.FC<SidebarProps> = ({
    channels,
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
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleToggleMute = () => {
        dispatch(toggleMute());
    };

    const handleToggleDeafen = () => {
        dispatch(toggleDeafen());
    };

    const handleOpenSettings = () => {
        setIsSettingsOpen(true);
    };

    const handleCloseSettings = () => {
        setIsSettingsOpen(false);
    };

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

            {/* Channel List */}
            <Box sx={{ p: 2 }}>
                <ChannelList
                    channels={channels}
                    selectedChannel={selectedChannel}
                    onSelectChannel={onSelectChannel}
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
