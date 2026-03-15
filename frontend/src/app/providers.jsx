import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import { queryClient } from '../services/queryClient';

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}