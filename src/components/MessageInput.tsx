import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import GifIcon from '@mui/icons-material/Gif';
import { EmojiData } from '../types/global';
import { MessageInputProps, Attachment } from '../types/global';
import AttachmentPreview from './AttachmentPreview';
import GifPicker from './GifPicker';
import EmojiPicker from './EmojiPicker';
import FileUploader from './FileUploader';

const getFileType = (file: File): 'image' | 'audio' | 'file' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'file';
};

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onSendGif,
  onSendAttachments,
  onRemoveAttachment,
}) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  
  let maxVisibleImages = 4;
  if (isXs) {
    maxVisibleImages = 2;
  } else if (isSm) {
    maxVisibleImages = 3;
  } else if (isMd) {
    maxVisibleImages = 4;
  } else if (isLgUp) {
    maxVisibleImages = 6;
  }

  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [gifAnchorEl, setGifAnchorEl] = useState<HTMLElement | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleSelectEmoji = useCallback(
    (emoji: EmojiData) => {
      setNewMessage((prev) => prev + emoji.native);
      handleEmojiClose();
    },
    [setNewMessage]
  );

  const handleGifClick = (event: React.MouseEvent<HTMLElement>) => {
    setGifAnchorEl(event.currentTarget);
  };

  const handleGifClose = () => {
    setGifAnchorEl(null);
    setError(null);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendGif(gifUrl);
    handleGifClose();
  };

  const handleFilesSelected = (files: FileList) => {
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      type: getFileType(file),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    onSendAttachments(newAttachments);
  };

  const handleRemoveAttachment = (id: number) => {
    const attachmentToRemove = attachments.find((att) => att.id === id);
    if (attachmentToRemove && attachmentToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments((prev) => prev.filter((att) => att.id !== id));
    onRemoveAttachment(id);
  };

  const handleSend = () => {
    onSend();
    setAttachments([]);
    // setNewMessage('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <AttachmentPreview
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          maxVisibleImages={maxVisibleImages}
        />
      )}

      {/* Message Input Field with End Adornments */}
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        multiline
        maxRows={4}
        placeholder="Say something..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* File Uploader */}
                <FileUploader onFilesSelected={handleFilesSelected} />

                {/* GIF Picker Button */}
                <Tooltip title="Add GIF">
                  <IconButton
                    onClick={handleGifClick}
                    color="primary"
                    aria-label="Add GIF"
                  >
                    <GifIcon />
                  </IconButton>
                </Tooltip>

                {/* Emoji Picker Button */}
                <Tooltip title="Add Emoji">
                  <IconButton
                    onClick={handleEmojiClick}
                    color="primary"
                    aria-label="Add Emoji"
                  >
                    <InsertEmoticonIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{ mr: 1 }}
      />

      {/* Send Button */}
      <Tooltip title="Send Message">
        <span>
          <IconButton
            color="primary"
            aria-label="Send Message"
            onClick={handleSend}
            disabled={newMessage.trim() === '' && attachments.length === 0}
            sx={{ height: '56px' }}
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* GIF Picker Popover */}
      <GifPicker
        open={Boolean(gifAnchorEl)}
        onClose={handleGifClose}
        onSelectGif={handleGifSelect}
        anchorEl={gifAnchorEl}
      />

      {/* Emoji Picker Popover */}
      <EmojiPicker
        open={Boolean(emojiAnchorEl)}
        onClose={handleEmojiClose}
        onSelectEmoji={handleSelectEmoji}
        anchorEl={emojiAnchorEl}
      />
    </Box>
  );
};

export default React.memo(MessageInput);
