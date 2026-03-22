import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { getBookDetails } from '../../services/bookApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToReadingList = useBookStore((s) => s.addToReadingList);
  const isInReadingList = useBookStore((s) => s.isInReadingList);
  const user = useAuthStore((s) => s.user);
  const alreadyAdded = isInReadingList(id);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['bookDetails', id],
    queryFn: () => getBookDetails(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Typography color="error">Failed to load book.</Typography>;
  if (!book) return null;

  const handleAdd = () => {
    addToReadingList(
      {
        id: book.id,
        title: book.title,
        authors: [],
        coverUrl: book.covers?.[0]?.replace('-L.jpg', '-M.jpg') || null,
        firstPublishYear: null,
        pages: null,
      },
      user?.id
    );
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
            sx={{ width: 250, borderRadius: 2, objectFit: 'cover' }}
          />
        )}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4">{book.title}</Typography>
            <Button
              variant={alreadyAdded ? 'outlined' : 'contained'}
              startIcon={alreadyAdded ? <CheckIcon /> : <AddIcon />}
              onClick={handleAdd}
              disabled={alreadyAdded}
              color={alreadyAdded ? 'success' : 'primary'}
            >
              {alreadyAdded ? 'In Reading List' : 'Add to Reading List'}
            </Button>
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
