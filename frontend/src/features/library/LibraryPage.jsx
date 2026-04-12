import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, Tabs, Tab, IconButton, Chip, LinearProgress, Divider,
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

const SECTIONS = [
  { key: 'reading',      label: 'Currently Reading' },
  { key: 'finished',     label: 'Finished' },
  { key: 'want_to_read', label: 'Read Later' },
  { key: 'favorites',    label: 'Favorites' },
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

function BookCard({ book, onFavorite }) {
  const navigate = useNavigate();
  const progress =
    book.pages && book.currentPage
      ? Math.min((book.currentPage / book.pages) * 100, 100)
      : 0;

  return (
    <Card
      sx={{
        width: 160,
        flexShrink: 0,
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
          sx={{ width: '100%', height: 220, objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%', height: 220,
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, opacity: 0.6 }}>
            {book.title.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      )}

      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); onFavorite(book.id); }}
        sx={{
          position: 'absolute', top: 4, right: 4,
          bgcolor: 'rgba(0,0,0,0.45)',
          color: book.isFavorite ? 'error.main' : 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
        }}
      >
        {book.isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>

      <Box sx={{ p: 1.5 }}>
        <Typography variant="body2" fontWeight={600} noWrap>{book.title}</Typography>
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
}

export default function LibraryPage() {
  const [tab, setTab] = useState(0);
  const user = useAuthStore((s) => s.user);
  const readingList = useBookStore((s) => s.readingList);
  const toggleFavorite = useBookStore((s) => s.toggleFavorite);

  const activeKey = TABS[tab].key;

  const getBooks = (key) => readingList.filter((b) => {
    if (key === 'favorites') return b.isFavorite;
    return b.status === key;
  });

  const handleFavorite = (bookId) => toggleFavorite(bookId, user?.id);

  const singleFiltered = activeKey !== 'all'
    ? readingList.filter((b) => {
        if (activeKey === 'favorites') return b.isFavorite;
        return b.status === activeKey;
      })
    : [];

  return (
    <div>
      <PageHeader title="My Library" subtitle="Your personal bookshelves" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {TABS.map((t) => (
          <Tab key={t.key} label={t.label} />
        ))}
      </Tabs>

      {/* Single-category tabs */}
      {activeKey !== 'all' && (
        singleFiltered.length === 0 ? (
          <Typography color="text.secondary">No books here yet.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {singleFiltered.map((book) => (
              <BookCard key={book.id} book={book} onFavorite={handleFavorite} />
            ))}
          </Box>
        )
      )}

      {/* All tab — grouped sections */}
      {activeKey === 'all' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map((section, i) => {
            const books = getBooks(section.key);
            if (books.length === 0) return null;
            return (
              <Box key={section.key}>
                {i > 0 && <Divider sx={{ mb: 3 }} />}
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {section.label}
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {books.length} {books.length === 1 ? 'book' : 'books'}
                  </Typography>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} onFavorite={handleFavorite} />
                  ))}
                </Box>
              </Box>
            );
          })}
          {SECTIONS.every((s) => getBooks(s.key).length === 0) && (
            <Typography color="text.secondary">No books in your library yet.</Typography>
          )}
        </Box>
      )}
    </div>
  );
}
