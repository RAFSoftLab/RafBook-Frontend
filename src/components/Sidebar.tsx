import React, { useState } from 'react';
import {
    Drawer,
    Typography,
    Divider,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen } from '../store/voiceSlice';
import SettingsModal from './SettingsModal';
import { SidebarProps } from '../types/global';
import UserControls from './UserControls';
import ChannelList from './ChannelList';

const Sidebar: React.FC<SidebarProps> = ({
    studyLevels,
    selectedStudyLevel,
    selectedStudyProgram,
    onSelectStudyLevel,
    onSelectStudyProgram,
    onSelectChannel,
    selectedChannelId,
    drawerWidth,
    mobileOpen,
    handleDrawerToggle,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user);
    const { isMuted, isDeafened } = useAppSelector((state) => state.voice);

    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [openCategories, setOpenCategories] = React.useState<{ [key: number]: boolean }>({});

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

    const handleToggleCategory = (categoryId: number) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            data-cy="sidebar"
        >
            {/* Top Section: Channels Heading */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap component="div" data-cy="channels-heading">
                    {selectedStudyProgram ? selectedStudyProgram.name : 'Channels'}
                </Typography>
            </Box>

            {/* Divider */}
            <Divider />

            {/* Channel List based on selectedStudyProgram */}
            {selectedStudyProgram ? (
                <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }} data-cy="channel-list-container">
                    {selectedStudyProgram.categories.map((category) => (
                        <Box key={category.id} sx={{ mb: 0 }} data-cy={`category-${category.id}`}>
                            <ListItemButton
                                onClick={() => handleToggleCategory(category.id)}
                                data-cy={`category-button-${category.id}`}
                            >
                                <ListItemText primary={category.name} />
                                {openCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {category.textChannels.map((channel) => (
                                        <ChannelList
                                            key={channel.id}
                                            channels={[channel]}
                                            selectedChannel={selectedChannelId}
                                            onSelectChannel={(id) => {
                                                onSelectChannel(id);
                                            }}
                                        />
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ p: 2 }} data-cy="study-levels-container">
                    <Typography variant="subtitle1" gutterBottom data-cy="study-levels-heading">
                        Study Levels
                    </Typography>
                    <List>
                        {studyLevels.map((studyLevel) => (
                            <ListItem key={studyLevel.id} disablePadding>
                                <ListItemButton
                                    onClick={() => onSelectStudyLevel(studyLevel)}
                                    data-cy={`study-level-item-${studyLevel.id}`}
                                >
                                    <ListItemText primary={studyLevel.name} secondary={studyLevel.description} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Spacer to push user controls to the bottom */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Section: User Controls */}
            <Box
                sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
                data-cy="user-controls"
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
                data-cy="mobile-drawer"
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
                data-cy="desktop-drawer"
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
