import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import GifIcon from '@mui/icons-material/Gif';
import { EmojiData } from '../types/global';
import { MessageInputProps, Attachment, AttachmentType } from '../types/global';
import AttachmentPreview from './AttachmentPreview';
import GifPicker from './GifPicker';
import EmojiPicker from './EmojiPicker';
import FileUploader from './FileUploader';

const getFileType = (file: File): AttachmentType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'voice';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
};

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onSendGif,
  onSendAttachments,
  onRemoveAttachment,
  previewMode,
  setPreviewMode,
}) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  let maxVisibleImages = 4;
  if (isXs) maxVisibleImages = 2;
  else if (isSm) maxVisibleImages = 3;
  else if (isMd) maxVisibleImages = 4;
  else if (isLgUp) maxVisibleImages = 6;

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

  const togglePreview = () => {
    setPreviewMode((prev) => !prev);
  };

  const handleSend = () => {
    onSend();
    setAttachments([]);
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
      data-cy="message-input-container"
    >
      {attachments.length > 0 && (
        <AttachmentPreview
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          maxVisibleImages={maxVisibleImages}
          data-cy="attachment-preview-container"
        />
      )}
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
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  data-cy="file-uploader-button"
                />
                <Tooltip title="Add GIF">
                  <IconButton
                    onClick={handleGifClick}
                    color="primary"
                    aria-label="Add GIF"
                    data-cy="add-gif-button"
                  >
                    <GifIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Emoji">
                  <IconButton
                    onClick={handleEmojiClick}
                    color="primary"
                    aria-label="Add Emoji"
                    data-cy="add-emoji-button"
                  >
                    <InsertEmoticonIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={previewMode ? 'Hide Preview' : 'Show Preview'}>
                  <Button onClick={togglePreview} variant="outlined" sx={{ ml: 1 }}>
                    {previewMode ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{ mr: 1 }}
        data-cy="message-textfield"
      />
      <Tooltip title="Send Message">
        <span>
          <IconButton
            color="primary"
            aria-label="Send Message"
            onClick={handleSend}
            disabled={newMessage.trim() === '' && attachments.length === 0}
            sx={{ height: '56px' }}
            data-cy="send-message-button"
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
      <GifPicker
        open={Boolean(gifAnchorEl)}
        onClose={handleGifClose}
        onSelectGif={handleGifSelect}
        anchorEl={gifAnchorEl}
        data-cy="gif-picker-popover"
      />
      <EmojiPicker
        open={Boolean(emojiAnchorEl)}
        onClose={handleEmojiClose}
        onSelectEmoji={handleSelectEmoji}
        anchorEl={emojiAnchorEl}
        data-cy="emoji-picker-popover"
      />
    </Box>
  );
};

export default React.memo(MessageInput);
