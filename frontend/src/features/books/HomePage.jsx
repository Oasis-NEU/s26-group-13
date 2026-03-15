import { Box, Typography, TextField, InputAdornment, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/common/PageHeader';
import BookCard from './components/BookCard';
import useBookSearch from './hooks/useBookSearch';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useBookStore from '../../store/bookStore';
import { getTrendingBooks } from '../../services/bookApi';

export default function HomePage() {
  const searchQuery = useBookStore((s) => s.searchQuery);
  const setSearchQuery = useBookStore((s) => s.setSearchQuery);
  const viewHistory = useBookStore((s) => s.viewHistory);

  const { data: books, isLoading, isError } = useBookSearch(searchQuery);

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingBooks'],
    queryFn: getTrendingBooks,
    staleTime: 1000 * 60 * 30,
  });

  return (
    <div>
      <PageHeader title="Discover Books" subtitle="Search millions of books from Open Library" />

      <TextField
        fullWidth
        placeholder="Search by title, author, or ISBN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {isLoading && <LoadingSpinner />}

      {isError && (
        <Typography color="error">Something went wrong. Try again.</Typography>
      )}

      {!isLoading && searchQuery.length >= 2 && books?.length === 0 && (
        <Typography color="text.secondary">No books found for "{searchQuery}"</Typography>
      )}

      {!isLoading && books?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Search Results</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Box>
        </Box>
      )}

      {(!searchQuery || searchQuery.length < 2) && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Trending Today</Typography>
            {trendingLoading ? (
              <LoadingSpinner />
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {trending?.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Box>
            )}
          </Box>

          {viewHistory.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>Recently Viewed</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {viewHistory.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </div>
  );
}
