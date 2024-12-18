import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { MessageInputProps } from '../types/global';


const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, onSend }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 2, height: '56px' }}
        onClick={onSend}
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

export default React.memo(MessageInput);
