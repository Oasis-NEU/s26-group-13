import { createTheme } from '@mui/material/styles';

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 600,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
};

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#5B4FCF',
      light: '#7E74D8',
      dark: '#4338A0',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#E04545',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: sharedComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C6CE0',
      light: '#9D90E8',
      dark: '#5B4FCF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#E04545',
    },
    background: {
      default: '#0f0f13',
      paper: '#1a1a24',
    },
    text: {
      primary: '#e8e8f0',
      secondary: '#9090a8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const natureTheme = createTheme({
  palette: {
    primary: {
      main: '#2d6a4f',
      light: '#52b788',
      dark: '#1b4332',
    },
    secondary: {
      main: '#d4a017',
      light: '#f0c040',
      dark: '#a07010',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 252, 242, 0.88)',
    },
    text: {
      primary: '#1a2e1a',
      secondary: '#3d5a3d',
    },
  },
  typography: {
    fontFamily: '"Georgia", "Palatino", serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default defaultTheme;
