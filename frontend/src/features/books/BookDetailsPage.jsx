import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Button, Chip, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckIcon from '@mui/icons-material/Check';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getBookDetails } from '../../services/bookApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

const SHELF_BUTTONS = [
  { key: 'reading', label: 'Currently Reading', icon: <MenuBookIcon /> },
  { key: 'want_to_read', label: 'Read Later', icon: <BookmarkAddIcon /> },
  { key: 'finished', label: 'Finished', icon: <DoneAllIcon /> },
];

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const readingList = useBookStore((s) => s.readingList);
  const addToReadingList = useBookStore((s) => s.addToReadingList);
  const updateStatus = useBookStore((s) => s.updateStatus);
  const toggleFavorite = useBookStore((s) => s.toggleFavorite);
  const setPageCount = useBookStore((s) => s.setPageCount);
  const user = useAuthStore((s) => s.user);
  const showToast = useToastStore((s) => s.showToast);

  const bookInList = readingList.find((b) => b.id === id);
  const currentStatus = bookInList?.status;
  const isFavorite = bookInList?.isFavorite;

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['bookDetails', id],
    queryFn: () => getBookDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (book?.pages && bookInList && !bookInList.pages) {
      setPageCount(id, book.pages);
    }
  }, [book?.pages, bookInList?.id]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Typography color="error">Failed to load book.</Typography>;
  if (!book) return null;

  const bookData = {
    id: book.id,
    title: book.title,
    authors: [],
    coverUrl: book.covers?.[0]?.replace('-L.jpg', '-M.jpg') || null,
    firstPublishYear: null,
    pages: book.pages || null,
  };

  const handleShelfClick = (status) => {
    const label = SHELF_BUTTONS.find((s) => s.key === status)?.label;
    if (!bookInList) {
      addToReadingList(bookData, user?.id, status);
      showToast(`"${book.title}" added to ${label}`);
    } else if (currentStatus !== status) {
      updateStatus(id, status, user?.id);
      showToast(`Moved to ${label}`);
    }
  };

  return (
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {book.covers?.[0] && (
          <Box
            component="img"
            src={book.covers[0]}
            alt={book.title}
            sx={{ width: 250, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
          />
        )}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <Typography variant="h4" sx={{ flex: 1 }}>{book.title}</Typography>
            {bookInList && (
              <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton
                  onClick={() => toggleFavorite(id, user?.id)}
                  color={isFavorite ? 'error' : 'default'}
                  sx={{ flexShrink: 0 }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {SHELF_BUTTONS.map(({ key, label, icon }) => {
              const selected = currentStatus === key;
              return (
                <Button
                  key={key}
                  variant={selected ? 'contained' : 'outlined'}
                  startIcon={selected ? <CheckIcon /> : icon}
                  onClick={() => handleShelfClick(key)}
                  size="small"
                  color="primary"
                  disabled={selected}
                  sx={selected ? {} : { borderColor: 'divider', color: 'text.secondary' }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          {book.firstPublishDate && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              First published: {book.firstPublishDate}
            </Typography>
          )}

          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            {book.description}
          </Typography>

          {book.subjects?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {book.subjects.map((subject) => (
                <Chip key={subject} label={subject} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
