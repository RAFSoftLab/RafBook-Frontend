import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TagIcon from '@mui/icons-material/Tag';

interface Channel {
    id: number;
    name: string;
}

interface ChannelListProps {
    channels: Channel[];
    selectedChannel: number;
    onSelectChannel: (id: number) => void;
    channelType: 'voice' | 'text';
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, selectedChannel, onSelectChannel, channelType }) => {
    const theme = useTheme();

    const getChannelIcon = (type: 'voice' | 'text') => {
        return type === 'voice' ? <VolumeUpIcon /> : <TagIcon />;
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
                            {getChannelIcon(channelType)}
                        </ListItemIcon>
                        <ListItemText primary={channel.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default ChannelList;
