import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, InputBase, Box,
  Paper, List, ListItemButton, ListItemAvatar, Avatar,
  ListItemText, CircularProgress, ClickAwayListener,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import useBookSearch from '../../features/books/hooks/useBookSearch';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Profile', path: '/profile' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { data: results, isLoading } = useBookSearch(query);
  const addToHistory = useBookStore((s) => s.addToHistory);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSelect = (book) => {
    addToHistory(book);
    setQuery('');
    setOpen(false);
    navigate(`/book/${book.id}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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

        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ position: 'relative', width: 320 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'grey.100',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search for books..."
                sx={{ fontSize: 14, width: '100%' }}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
              />
              {isLoading && <CircularProgress size={18} />}
            </Box>

            {open && query.length >= 2 && results?.length > 0 && (
              <Paper sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 0.5,
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 1300,
              }}>
                <List dense>
                  {results.slice(0, 8).map((book) => (
                    <ListItemButton key={book.id} onClick={() => handleSelect(book)}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={book.coverUrl}
                          sx={{ width: 40, height: 56 }}
                        >
                          ?
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={book.title}
                        secondary={`${book.authors?.[0] || 'Unknown'} ${book.firstPublishYear ? `· ${book.firstPublishYear}` : ''}`}
                        primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {user.user_metadata?.display_name || user.email}
            </Typography>
            <Button
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ color: 'text.secondary' }}
            >
              Log out
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" size="small" onClick={() => navigate('/login')}>
            Log In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
