import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, Tabs, Tab, IconButton, Chip, LinearProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PageHeader from '../../components/common/PageHeader';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';

const TABS = [
  { label: 'All', key: 'all' },
  { label: 'Reading', key: 'reading' },
  { label: 'Finished', key: 'finished' },
  { label: 'Read Later', key: 'want_to_read' },
  { label: 'Favorites', key: 'favorites' },
];

const STATUS_LABEL = {
  reading: 'Reading',
  finished: 'Finished',
  want_to_read: 'Read Later',
  to_read: 'To Read',
};

const STATUS_COLOR = {
  reading: 'primary',
  finished: 'success',
  want_to_read: 'default',
  to_read: 'default',
};

export default function LibraryPage() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const readingList = useBookStore((s) => s.readingList);
  const toggleFavorite = useBookStore((s) => s.toggleFavorite);

  const activeKey = TABS[tab].key;
  const filtered = readingList.filter((b) => {
    if (activeKey === 'all') return true;
    if (activeKey === 'favorites') return b.isFavorite;
    return b.status === activeKey;
  });

  return (
    <div>
      <PageHeader title="My Library" subtitle="Your personal bookshelves" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {TABS.map((t) => (
          <Tab key={t.key} label={t.label} />
        ))}
      </Tabs>

      {filtered.length === 0 ? (
        <Typography color="text.secondary">No books here yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filtered.map((book) => {
            const progress =
              book.pages && book.currentPage
                ? Math.min((book.currentPage / book.pages) * 100, 100)
                : 0;

            return (
              <Card
                key={book.id}
                sx={{
                  width: 170,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {book.coverUrl ? (
                  <Box
                    component="img"
                    src={book.coverUrl}
                    alt={book.title}
                    sx={{ width: '100%', height: 240, objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 240,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, opacity: 0.6 }}>
                      {book.title.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                )}

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book.id, user?.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.45)',
                    color: book.isFavorite ? 'error.main' : 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                  }}
                >
                  {book.isFavorite ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>

                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {book.authors?.[0] || 'Unknown author'}
                  </Typography>
                  {book.status && (
                    <Chip
                      label={STATUS_LABEL[book.status] || book.status}
                      color={STATUS_COLOR[book.status] || 'default'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                  {progress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ mt: 0.75, borderRadius: 1, height: 4 }}
                    />
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </div>
  );
}
