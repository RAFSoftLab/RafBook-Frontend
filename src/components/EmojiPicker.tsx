import React from 'react';
import { Popover } from '@mui/material';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { EmojiData } from '../types/global';
import { useTheme, useMediaQuery } from '@mui/material';

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: EmojiData) => void;
  anchorEl: HTMLElement | null;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ open, onClose, onSelectEmoji, anchorEl }) => {
  if (!open) return null;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const pickerWidth = isLargeScreen ? 350 : isSmallScreen ? 300 : 350;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        style: { width: pickerWidth },
      }}
    >
      <Picker data={data} onEmojiSelect={onSelectEmoji} />
    </Popover>
  );
};

export default React.memo(EmojiPicker);
