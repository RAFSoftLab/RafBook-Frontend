import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Popover,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import GifIcon from '@mui/icons-material/Gif';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { MessageInputProps } from '../types/global';
import debounce from 'lodash.debounce';
import { EmojiData } from '../types/global';

const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY || '';
const gf = new GiphyFetch(giphyApiKey);

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onSendGif,
}) => {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [gifAnchorEl, setGifAnchorEl] = useState<HTMLElement | null>(null);
  const [gifSearchTerm, setGifSearchTerm] = useState<string>('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleSelectEmoji = useCallback((emoji: EmojiData) => {
    setNewMessage((prev) => prev + emoji.native);
  }, [setNewMessage]);

  const handleGifClick = (event: React.MouseEvent<HTMLElement>) => {
    setGifAnchorEl(event.currentTarget);
  };

  const handleGifClose = () => {
    setGifAnchorEl(null);
    setGifSearchTerm('');
    setGifs([]);
  };

  const fetchGifs = useCallback(async (query: string) => {
    if (query.trim() === '') {
      setGifs([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await gf.search(query, { limit: 5 });
      setGifs(response.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      setGifs([]);
    } finally {
      setIsLoading(false);
    }
  }, [gf]);

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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
      }}
    >
      {/* Message Input Field */}
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
        sx={{ mr: 1 }}
      />

      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ height: '56px', mr: 1 }}
        onClick={onSend}
        disabled={newMessage.trim() === ''}
        aria-label="Send Message"
      >
        <SendIcon />
      </Button>

      {/* GIF Picker Button */}
      <IconButton
        onClick={handleGifClick}
        color="primary"
        aria-label="Add GIF"
      >
        <GifIcon />
      </IconButton>
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
          style: { width: 300, padding: 10 },
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
            <ImageList cols={1} rowHeight={100} gap={8}>
              {gifs.map((gif) => (
                <ImageListItem key={gif.id}>
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    loading="lazy"
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
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

      {/* Emoji Picker Button */}
      <IconButton
        onClick={handleEmojiClick}
        color="primary"
        aria-label="Add Emoji"
      >
        <InsertEmoticonIcon />
      </IconButton>
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
