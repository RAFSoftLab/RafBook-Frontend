import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TextsmsIcon from '@mui/icons-material/Textsms';
import { ChannelListProps } from '../types/global';

const ChannelList: React.FC<ChannelListProps> = ({ channels, selectedChannel, onSelectChannel }) => {
    const theme = useTheme();

    const getChannelIcon = (type: 'text' | 'voice') => {
        return type === 'voice' ? <VolumeUpIcon /> : <TextsmsIcon />;
    };

    return (
        <List>
            {channels.map((channel) => (
                <ListItem key={channel.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        onClick={() => onSelectChannel(channel.id)}
                        selected={selectedChannel === channel.id}
                        sx={{
                            borderRadius: 2,
                            paddingY: 1,
                            paddingX: 2,
                            display: 'flex',
                            alignItems: 'center',
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.action.selected,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                },
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            {getChannelIcon(channel.type)}
                        </ListItemIcon>
                        <ListItemText primary={channel.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default ChannelList;
