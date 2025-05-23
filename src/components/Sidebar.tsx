import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore, Tag } from '@mui/icons-material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMute, toggleDeafen } from '../store/voiceSlice';
import SettingsModal from './SettingsModal';
import { SidebarProps, Channel } from '../types/global';
import UserControls from './UserControls';

const Sidebar: React.FC<SidebarProps> = ({
  studyLevels,
  selectedStudyProgram,
  onSelectStudyLevel,
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({});

  React.useEffect(() => {
    if (selectedStudyProgram) {
      const initialOpen: { [key: number]: boolean } = {};
      selectedStudyProgram.categories.forEach((category) => {
        initialOpen[category.id] = true;
      });
      setOpenCategories(initialOpen);
    }
  }, [selectedStudyProgram]);

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

  const categoryTextColor =
    theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600];
  const hoverTextColor =
    theme.palette.mode === 'dark'
      ? theme.palette.grey[300]
      : theme.palette.grey[700];

  const getChannelIcon = (channel: Channel) => {
    return channel.type === 'voice' ? (
      <VolumeUpIcon sx={{ fontSize: '1.2em', mr: 1 }} data-cy="voice-icon" />
    ) : (
      <Tag sx={{ fontSize: '1.2em', mr: 1 }} data-cy="tag-icon" />
    );
  };

  const renderChannels = (category: any) => {
    const mergedChannels: Channel[] = [
      ...category.textChannels,
      ...category.voiceChannels,
    ].sort((a, b) => a.name.localeCompare(b.name));

    return (
      <List component="div" disablePadding>
        {mergedChannels.map((channel: Channel) => (
          <ListItemButton
            disableRipple
            key={channel.id}
            sx={{
              ml: 1,
              mr: 1,
              mb: 0.33,
              py: 0.5,
              color: categoryTextColor,
              backgroundColor: 'transparent',
              borderRadius: '4px',
              '&:hover': {
                color: hoverTextColor,
                backgroundColor: theme.palette.action.hover,
              },
              ...(selectedChannelId === channel.id && {
                color: hoverTextColor,
              }),
            }}
            onClick={() => onSelectChannel(channel.id)}
            selected={selectedChannelId === channel.id}
            data-cy={`channel-${channel.id}`}
          >
            {getChannelIcon(channel)}
            <ListItemText
              primary={channel.name}
              primaryTypographyProps={{
                variant: 'body2',
                sx: { fontSize: '0.9em', color: 'inherit' },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.default,
      }}
      data-cy="sidebar"
    >
      {/* Top Section: Channels Heading */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div" data-cy="channels-heading">
          {selectedStudyProgram ? selectedStudyProgram.name : 'Channels'}
        </Typography>
      </Box>

      <Divider />

      {selectedStudyProgram ? (
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }} data-cy="channel-list-container">
          {selectedStudyProgram.categories.map((category, index) => (
            <Box key={category.id} sx={{ pt: index === 0 ? 4 : 0, mb: 2 }} data-cy={`category-${category.id}`}>
              <ListItemButton
                disableRipple
                onClick={() => handleToggleCategory(category.id)}
                sx={{
                  pl: 0,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: categoryTextColor,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    color: hoverTextColor,
                    backgroundColor: 'transparent',
                  },
                }}
                data-cy={`category-button-${category.id}`}
              >
                {openCategories[category.id] ? (
                  <ExpandLess sx={{ fontSize: '1rem', color: 'inherit' }} />
                ) : (
                  <ExpandMore sx={{ fontSize: '1rem', color: 'inherit' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    fontWeight: 'bold',
                    fontSize: '0.7em',
                    color: 'inherit',
                  }}
                >
                  {category.name}
                </Typography>
              </ListItemButton>

              <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
                {renderChannels(category)}
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
              <Box key={studyLevel.id}>
                <ListItemButton
                  disableRipple
                  onClick={() => onSelectStudyLevel(studyLevel)}
                  data-cy={`study-level-item-${studyLevel.id}`}
                >
                  <ListItemText primary={studyLevel.name} secondary={studyLevel.description} />
                </ListItemButton>
              </Box>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom Section: User Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
        data-cy="user-controls"
      >
        <Box
          sx={{
            borderRadius: '12px 12px 0 0',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            p: 4,
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
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
      </Box>

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
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
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
          display: { xs: 'none', md: 'block' },
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
