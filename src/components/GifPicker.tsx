import React, { useState, useEffect, useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  Box,
  TextField,
  ImageList,
  ImageListItem,
  CircularProgress,
  Typography,
  Popover,
} from '@mui/material';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import debounce from 'lodash.debounce';

interface GifPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectGif: (gifUrl: string) => void;
  anchorEl: HTMLElement | null;
}

const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY || '';
const gf = new GiphyFetch(giphyApiKey);

const GifPicker: React.FC<GifPickerProps> = ({ open, onClose, onSelectGif, anchorEl }) => {
  const [gifSearchTerm, setGifSearchTerm] = useState<string>('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const gifCols = isLargeScreen ? 3 : isMediumScreen ? 2 : 2;

  const fetchTrendingGifs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await gf.trending({ limit: 20 });
      setGifs(response.data);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
      setError('Failed to load trending GIFs. Please try again.');
      setGifs([]);
    } finally {
      setIsLoading(false);
    }
  }, [gf]);

  const fetchSearchGifs = useCallback(
    async (query: string) => {
      if (query.trim() === '') {
        await fetchTrendingGifs();
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await gf.search(query, { limit: 20 });
        setGifs(response.data);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
        setError('Failed to load GIFs. Please try again.');
        setGifs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [gf, fetchTrendingGifs]
  );

  const debouncedFetchSearchGifs = useCallback(
    debounce((query: string) => {
      fetchSearchGifs(query);
    }, 500),
    [fetchSearchGifs]
  );

  useEffect(() => {
    if (open) {
      fetchTrendingGifs();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      debouncedFetchSearchGifs(gifSearchTerm);
    }
    return () => {
      debouncedFetchSearchGifs.cancel();
    };
  }, [gifSearchTerm, debouncedFetchSearchGifs, open]);

  const handleGifSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGifSearchTerm(e.target.value);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSelectGif(gifUrl);
    onClose();
  };

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
      PaperProps={{
        sx: {
          width: isSmallScreen ? '90vw' : '600px',
          height: isSmallScreen ? '60vh' : isMediumScreen ? '70vh' : '80vh',
          padding: 2,
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      }}
      disablePortal={false}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Search Bar */}
        <TextField
          autoFocus
          label="Search GIFs"
          variant="outlined"
          size="medium"
          fullWidth
          value={gifSearchTerm}
          onChange={handleGifSearch}
          placeholder="e.g., funny cats"
          InputProps={{
            endAdornment: isLoading && <CircularProgress size={24} />,
          }}
        />

        {/* GIFs or Loading/Error */}
        <Box
          sx={{
            mt: 2,
            overflowY: 'auto',
            flexGrow: 1,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : gifs.length > 0 ? (
            <ImageList variant="masonry" cols={gifCols} gap={16}>
              {gifs.map((gif) => (
                <ImageListItem key={gif.id}>
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    loading="lazy"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      width: '100%',
                      height: 'auto',
                      transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick={() => handleGifSelect(gif.images.original.url)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
              {error ? error : 'No GIFs found. Try a different search term.'}
            </Typography>
          )}
        </Box>
      </Box>
    </Popover>
  );
};

export default React.memo(GifPicker);
