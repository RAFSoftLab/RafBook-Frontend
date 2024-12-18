import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Tooltip,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import GifIcon from '@mui/icons-material/Gif';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { MessageInputProps, Attachment } from '../types/global';
import debounce from 'lodash.debounce';
import { EmojiData } from '../types/global';

const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY || '';
const gf = new GiphyFetch(giphyApiKey);

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onSendGif,
  onSendAttachments,
}) => {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [gifAnchorEl, setGifAnchorEl] = useState<HTMLElement | null>(null);
  const [gifSearchTerm, setGifSearchTerm] = useState<string>('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const emojiButtonRef = React.useRef<HTMLButtonElement>(null);
  const gifButtonRef = React.useRef<HTMLButtonElement>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const gifCols = isSmallScreen ? 1 : 2;

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleSelectEmoji = useCallback(
    (emoji: EmojiData) => {
      setNewMessage((prev) => prev + emoji.native);
    },
    [setNewMessage]
  );

  const handleGifClick = (event: React.MouseEvent<HTMLElement>) => {
    setGifAnchorEl(event.currentTarget);
  };

  const handleGifClose = () => {
    setGifAnchorEl(null);
    setGifSearchTerm('');
    setGifs([]);
  };

  const fetchGifs = useCallback(
    async (query: string) => {
      if (query.trim() === '') {
        setGifs([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await gf.search(query, { limit: 10 });
        setGifs(response.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
        setGifs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [gf]
  );

  const debouncedFetchGifs = useCallback(
    debounce((query: string) => {
      fetchGifs(query);
    }, 500),
    [fetchGifs]
  );

  useEffect(() => {
    debouncedFetchGifs(gifSearchTerm);
    return () => {
      debouncedFetchGifs.cancel();
    };
  }, [gifSearchTerm, debouncedFetchGifs]);

  const handleGifSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGifSearchTerm(e.target.value);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendGif(gifUrl);
    handleGifClose();
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        type: getFileType(file),
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
      onSendAttachments(newAttachments);
    }
  };

  const getFileType = (file: File): 'image' | 'audio' | 'file' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'file';
  };

  const handleRemoveAttachment = (id: number) => {
    const attachmentToRemove = attachments.find((att) => att.id === id);
    if (attachmentToRemove && attachmentToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments((prev) => prev.filter((att) => att.id !== id));
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
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '70px',
            left: '10px',
            right: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Attachments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {attachments.map((attachment) => (
              <Box
                key={attachment.id}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid #ccc',
                }}
              >
                {attachment.type === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.name || 'Image Attachment'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {attachment.type === 'audio' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <Typography variant="caption">Audio</Typography>
                  </Box>
                )}
                {attachment.type === 'file' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                      textAlign: 'center',
                      p: 1,
                    }}
                  >
                    <Typography variant="caption" noWrap>
                      {attachment.name || 'File'}
                    </Typography>
                  </Box>
                )}
                {/* Remove Attachment Button */}
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'rgba(255,255,255,0.7)',
                  }}
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  aria-label={`Remove ${attachment.type} attachment`}
                >
                  <Typography variant="caption">×</Typography>
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
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
            onSend();
          }
        }}
        multiline
        maxRows={4}
        placeholder="Say something..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Attach File Button */}
                <Tooltip title="Attach File">
                  <IconButton
                    color="primary"
                    aria-label="Attach File"
                    component="label"
                  >
                    <AttachFileIcon />
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleAttachmentChange}
                      accept="image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  </IconButton>
                </Tooltip>

                {/* GIF Picker Button */}
                <Tooltip title="Add GIF">
                  <IconButton
                    onClick={handleGifClick}
                    color="primary"
                    aria-label="Add GIF"
                    ref={gifButtonRef}
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
                    ref={emojiButtonRef}
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
            onClick={onSend}
            disabled={newMessage.trim() === '' && attachments.length === 0}
            sx={{ height: '56px' }}
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* GIF Picker Popover */}
      <Popover
        open={Boolean(gifAnchorEl)}
        anchorEl={gifAnchorEl}
        onClose={handleGifClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { width: 600, padding: 10 },
        }}
      >
        <TextField
          label="Search GIFs"
          variant="outlined"
          size="small"
          fullWidth
          value={gifSearchTerm}
          onChange={handleGifSearch}
          placeholder="e.g., funny cats"
          InputProps={{
            endAdornment: isLoading && <CircularProgress size={20} />,
          }}
        />
        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Typography>Loading GIFs...</Typography>
          ) : gifs.length > 0 ? (
            <ImageList variant="masonry" cols={gifCols} gap={8}>
              {gifs.map((gif) => (
                <ImageListItem key={gif.id}>
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    loading="lazy"
                    style={{ cursor: 'pointer', borderRadius: '8px', width: '100%', height: 'auto' }}
                    onClick={() => handleGifSelect(gif.images.original.url)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            gifSearchTerm !== '' && <Typography>No GIFs found.</Typography>
          )}
        </Box>
      </Popover>

      {/* Emoji Picker Popover */}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Picker data={data} onEmojiSelect={handleSelectEmoji} />
      </Popover>
    </Box>
  );
};

export default React.memo(MessageInput);
