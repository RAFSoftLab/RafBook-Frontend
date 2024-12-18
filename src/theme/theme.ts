import { createTheme, Theme } from '@mui/material/styles';
import {
  indigo,
  blue,
  deepPurple,
  cyan,
  red,
  grey,
  amber,
  teal,
  pink,
  green,
  deepOrange,
} from '@mui/material/colors';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

declare module '@mui/material/styles' {
  interface Palette {
    avatar: {
      ownMessage: string;
      otherMessage: string;
    };
  }
  interface PaletteOptions {
    avatar?: {
      ownMessage?: string;
      otherMessage?: string;
    };
  }
}

const getTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? indigo[600] : red[500],
      },
      secondary: {
        main: mode === 'light' ? teal[500] : cyan[500],
      },
      error: {
        main: mode === 'light' ? red[600] : red[400],
      },
      warning: {
        main: mode === 'light' ? amber[700] : amber[500],
      },
      success: {
        main: mode === 'light' ? green[600] : green[400],
      },
      background: {
        default: mode === 'light' ? grey[100] : grey[900],
        paper: mode === 'light' ? '#ffffff' : grey[800],
      },
      text: {
        primary: mode === 'light' ? grey[900] : grey[100],
        secondary: mode === 'light' ? grey[700] : grey[300],
      },
      avatar: {
        ownMessage: mode === 'light' ? deepPurple[500] : pink[500],
        otherMessage: mode === 'light' ? deepOrange[500] : amber[500],
      },
    },
    typography: {
      fontFamily: '"Open Sans", "Roboto", Arial, sans-serif',
      h4: {
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
      },
      // Additional typography customizations
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            transition: 'box-shadow 0.3s, background-color 0.3s',
            '&:hover': {
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            },
          },
        },
        variants: [],
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiFilledInput-root': {
              backgroundColor: mode === 'light' ? grey[200] : grey[800],
              borderRadius: 8,
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: mode === 'light' ? grey[300] : grey[700],
              },
              '&.Mui-focused': {
                backgroundColor: mode === 'light' ? grey[300] : grey[700],
                color: mode === 'light' ? grey[900] : grey[100],
              },
              '&:before': {
                borderBottom: 'none',
              },
              '&:hover:before': {
                borderBottom: 'none',
              },
              '&:after': {
                borderBottom: `2px solid ${
                  mode === 'light' ? indigo[600] : deepPurple[500]
                }`,
              },
            },
            '& .MuiInputLabel-filled': {
              color: mode === 'light' ? grey[700] : grey[300],
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? blue[600] : cyan[500],
            '&.Mui-checked': {
              color: mode === 'light' ? indigo[600] : red[500],
            },
            '&:not(.Mui-checked)': {
              color: mode === 'light' ? indigo[600] : red[500],
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardError: {
            backgroundColor: mode === 'light' ? red[50] : grey[800],
            color: mode === 'light' ? red[800] : red[300],
          },
          standardWarning: {
            backgroundColor: mode === 'light' ? amber[50] : grey[800],
            color: mode === 'light' ? amber[800] : amber[300],
          },
          standardSuccess: {
            backgroundColor: mode === 'light' ? green[50] : grey[800],
            color: mode === 'light' ? green[800] : green[300],
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

export default getTheme;
