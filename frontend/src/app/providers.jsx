import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { defaultTheme, darkTheme, natureTheme } from './theme';
import { queryClient } from '../services/queryClient';
import useThemeStore from '../store/themeStore';

const THEMES = {
  default: defaultTheme,
  dark: darkTheme,
  nature: natureTheme,
};

export default function Providers({ children }) {
  const themeName = useThemeStore((s) => s.theme);
  const activeTheme = THEMES[themeName] || defaultTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
