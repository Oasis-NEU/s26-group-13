import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import NatureNav from '../components/common/NatureNav';
import ForestBackground from '../components/common/ForestBackground';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MainLayout() {
  const loading = useAuthStore((s) => s.loading);
  const theme = useThemeStore((s) => s.theme);

  if (loading) return <LoadingSpinner />;

  if (theme === 'nature') {
    return (
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <ForestBackground />
        <NatureNav />
        <Box
          component="main"
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1200,
            mx: 'auto',
            p: 3,
            pt: '90px', // offset for fixed NatureNav
          }}
        >
          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
