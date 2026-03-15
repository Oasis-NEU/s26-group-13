import { AppBar, Toolbar, Typography, Button, InputBase, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Profile', path: '/profile' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', color: 'primary.main', mr: 2 }}
          onClick={() => navigate('/')}
        >
          BookTracker
        </Typography>

        {navLinks.map((link) => (
          <Button
            key={link.path}
            onClick={() => navigate(link.path)}
            sx={{
              color: location.pathname === link.path ? 'primary.main' : 'text.secondary',
              fontWeight: location.pathname === link.path ? 700 : 500,
            }}
          >
            {link.label}
          </Button>
        ))}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'grey.100',
          borderRadius: 2,
          px: 2,
          py: 0.5,
        }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase placeholder="Search for books..." sx={{ fontSize: 14 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
