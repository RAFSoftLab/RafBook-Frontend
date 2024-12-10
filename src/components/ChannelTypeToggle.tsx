import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextsmsIcon from '@mui/icons-material/Textsms';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useTheme } from '@mui/material/styles';

interface ChannelTypeToggleProps {
    channelType: 'voice' | 'text';
    onChange: (event: React.MouseEvent<HTMLElement>, newType: 'voice' | 'text' | null) => void;
}

const ChannelTypeToggle: React.FC<ChannelTypeToggleProps> = ({ channelType, onChange }) => {
    const theme = useTheme();

    return (
        <ToggleButtonGroup
            value={channelType}
            exclusive
            onChange={onChange}
            aria-label="channel type"
            fullWidth
            size="small"
            sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
            }}
        >
            <ToggleButton
                value="text"
                aria-label="text channel"
                sx={{
                    borderRadius: 0,
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                    '&:not(:first-of-type)': {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >
                <TextsmsIcon sx={{ mr: 1 }} />
                Text
            </ToggleButton>
            <ToggleButton
                value="voice"
                aria-label="voice channel"
                sx={{
                    borderRadius: 0,
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                    '&:not(:first-of-type)': {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >
                <VolumeUpIcon sx={{ mr: 1 }} />
                Voice
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ChannelTypeToggle;
