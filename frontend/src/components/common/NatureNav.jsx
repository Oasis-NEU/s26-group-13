import { useState } from 'react';
import {
  Box, Button, InputBase, Paper, List, ListItemButton,
  ListItemAvatar, Avatar, ListItemText, CircularProgress,
  ClickAwayListener, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useBookSearch from '../../features/books/hooks/useBookSearch';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import ThemeSelector from './ThemeSelector';

const navLinks = [
  { label: 'Home',    path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Social',  path: '/social' },
  { label: 'Timer',   path: '/timer' },
  { label: 'Profile', path: '/profile' },
];

export default function NatureNav() {
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

  const pillBase = {
    borderRadius: '999px',
    backdropFilter: 'blur(10px)',
    bgcolor: 'rgba(255,252,242,0.82)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    border: '1px solid rgba(45,106,79,0.2)',
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        px: 3,
        pointerEvents: 'none',
      }}
    >
      {/* Logo pill */}
      <Box
        sx={{
          ...pillBase,
          px: 2.5,
          py: 1,
          cursor: 'pointer',
          pointerEvents: 'auto',
          color: 'primary.main',
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onClick={() => navigate('/')}
      >
        Chapters
      </Box>

      {/* Nav link pills */}
      {navLinks.map((link) => {
        const active = location.pathname === link.path;
        return (
          <Button
            key={link.path}
            onClick={() => navigate(link.path)}
            sx={{
              ...pillBase,
              pointerEvents: 'auto',
              px: 2,
              py: 0.75,
              color: active ? 'primary.main' : 'text.secondary',
              fontWeight: active ? 700 : 500,
              bgcolor: active ? 'rgba(45,106,79,0.18)' : 'rgba(255,252,242,0.82)',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: 'rgba(45,106,79,0.12)',
              },
            }}
          >
            {link.label}
          </Button>
        );
      })}

      <Box sx={{ flexGrow: 1 }} />

      {/* Search pill */}
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box sx={{ position: 'relative', pointerEvents: 'auto' }}>
          <Box
            sx={{
              ...pillBase,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.75,
              width: 280,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Search for books..."
              sx={{ fontSize: 14, width: '100%', fontFamily: 'Georgia, serif' }}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
            />
            {isLoading && <CircularProgress size={16} />}
          </Box>
          {open && query.length >= 2 && results?.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 1300,
                bgcolor: 'rgba(255,252,242,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
              }}
            >
              <List dense>
                {results.slice(0, 8).map((book) => (
                  <ListItemButton key={book.id} onClick={() => handleSelect(book)}>
                    <ListItemAvatar>
                      <Avatar variant="rounded" src={book.coverUrl} sx={{ width: 40, height: 56 }}>?</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={book.title}
                      secondary={`${book.authors?.[0] || 'Unknown'}${book.firstPublishYear ? ` · ${book.firstPublishYear}` : ''}`}
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

      {/* Help pill */}
      <Tooltip title="Help">
        <Box sx={{ ...pillBase, pointerEvents: 'auto', display: 'flex', alignItems: 'center', px: 1, py: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate('/help')}
            sx={{ color: location.pathname === '/help' ? 'primary.main' : 'text.primary' }}
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </Tooltip>

      {/* Theme selector pill */}
      <Box sx={{ ...pillBase, pointerEvents: 'auto', display: 'flex', alignItems: 'center', px: 1, py: 0.5 }}>
        <ThemeSelector />
      </Box>

      {/* Auth pill */}
      <Box sx={{ ...pillBase, pointerEvents: 'auto', display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, gap: 1 }}>
        {user ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {user.user_metadata?.display_name || user.email}
            </Typography>
            <Button
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ color: 'text.secondary', minWidth: 'auto', px: 1, py: 0.25, borderRadius: '999px' }}
            >
              Log out
            </Button>
          </>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: '999px', px: 2 }}
          >
            Log In
          </Button>
        )}
      </Box>
    </Box>
  );
}
