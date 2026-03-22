import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MainLayout() {
  const loading = useAuthStore((s) => s.loading);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
