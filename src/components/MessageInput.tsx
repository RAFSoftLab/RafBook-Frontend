import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { EmojiData, Attachment, Type } from '../types/global';
import AttachmentPreview from './AttachmentPreview';
import GifPicker from './GifPicker';
import EmojiPicker from './EmojiPicker';
import FileUploader from './FileUploader';

const getFileType = (file: File): Type => {
  if (file.type.startsWith('image/')) return Type.IMAGE;
  if (file.type.startsWith('audio/')) return Type.VOICE;
  if (file.type.startsWith('video/')) return Type.VIDEO;
  return Type.FILE;
};

interface MessageInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  onSendGif: (gifUrl: string) => void;
  onSendAttachments: (newAttachments: Attachment[]) => void;
  onRemoveAttachment: (id: number) => void;
  editingContent?: string;
  autoFocus?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onSendGif,
  onSendAttachments,
  onRemoveAttachment,
  editingContent,
  autoFocus,
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

  const [message, setMessage] = useState('');
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [gifAnchorEl, setGifAnchorEl] = useState<HTMLElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingContent !== undefined) {
      setMessage(editingContent);
    } else {
      setMessage('');
    }
  }, [editingContent]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleSelectEmoji = useCallback(
    (emoji: EmojiData) => {
      setMessage((prev) => prev + emoji.native);
      handleEmojiClose();
    },
    []
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
      file
    }));
    setLocalAttachments((prev) => [...prev, ...newAttachments]);
    onSendAttachments(newAttachments);
  };

  const handleRemoveAttachment = (id: number) => {
    const attachmentToRemove = localAttachments.find((att) => att.id === id);
    if (attachmentToRemove && attachmentToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setLocalAttachments((prev) => prev.filter((att) => att.id !== id));
    onRemoveAttachment(id);
  };

  const togglePreview = () => {
    setPreviewMode((prev) => !prev);
  };

  const handleSend = () => {
    if (message.trim() === '' && localAttachments.length === 0) return;
    onSend(message, localAttachments);
    setMessage('');
    setLocalAttachments([]);
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
      {localAttachments.length > 0 && (
        <AttachmentPreview
          attachments={localAttachments}
          onRemoveAttachment={handleRemoveAttachment}
          maxVisibleImages={maxVisibleImages}
          data-cy="attachment-preview-container"
        />
      )}
      <TextField
        inputRef={inputRef}
        label="Type a message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
            disabled={message.trim() === '' && localAttachments.length === 0}
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
