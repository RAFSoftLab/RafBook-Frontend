// EmojiPicker.tsx
import React from 'react';
import { Popover, Box } from '@mui/material';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelectEmoji: (emoji: any) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  open,
  anchorEl,
  onClose,
  onSelectEmoji,
}) => {
  // Don't render anything if not open to avoid the anchorEl issue
  if (!open || !anchorEl) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box sx={{ p: 1 }}>
        <Picker
          data={data}
          onEmojiSelect={onSelectEmoji}
          previewPosition="none"
        />
      </Box>
    </Popover>
  );
};

export default EmojiPicker;