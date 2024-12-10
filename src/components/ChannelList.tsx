import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';
import TagIcon from '@mui/icons-material/Tag';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

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
    const getChannelIcon = (type: 'voice' | 'text') => {
        return type === 'voice' ? <VolumeUpIcon /> : <Typography variant="body2">#</Typography>;
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
                                backgroundColor: 'action.selected',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                },
                            },
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            {channelType === 'voice' ? <VolumeUpIcon /> : <TagIcon />}
                        </ListItemIcon>
                        <ListItemText primary={channel.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default ChannelList;