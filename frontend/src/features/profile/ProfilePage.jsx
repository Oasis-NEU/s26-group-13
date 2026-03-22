import { useState } from 'react';
import {
  Avatar, Box, Typography, Card, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, LinearProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const readingList = useBookStore((s) => s.readingList);
  const removeFromReadingList = useBookStore((s) => s.removeFromReadingList);
  const updateProgress = useBookStore((s) => s.updateProgress);

  const [progressDialog, setProgressDialog] = useState({ open: false, book: null });
  const [pageInput, setPageInput] = useState('');

  const handleOpenProgress = (e, book) => {
    e.stopPropagation();
    setPageInput(book.currentPage?.toString() || '0');
    setProgressDialog({ open: true, book });
  };

  const handleSaveProgress = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 0 && progressDialog.book) {
      updateProgress(progressDialog.book.id, page, user?.id);
    }
    setProgressDialog({ open: false, book: null });
  };

  const totalPages = readingList.reduce((sum, b) => sum + (b.currentPage || 0), 0);
  const booksStarted = readingList.filter((b) => b.currentPage > 0).length;
  const booksFinished = readingList.filter(
    (b) => b.pages && b.currentPage >= b.pages
  ).length;

  const displayName = user?.user_metadata?.display_name || user?.email || 'Guest';

  return (
    <div>
      <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: user ? 'primary.main' : 'grey.300' }}>
          {user ? displayName.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Box>
          <Typography variant="h5">{user ? displayName : 'Guest'}</Typography>
          {user && (
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {readingList.length} Books
              </Typography>
              <Typography variant="body2" color="text.secondary">0 Following</Typography>
              <Typography variant="body2" color="text.secondary">0 Followers</Typography>
            </Box>
          )}
          {!user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Log in to save your reading data
            </Typography>
          )}
        </Box>
      </Box>

      {!user && (
        <Card sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Save your reading data</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Create an account to track your reading progress, set goals, and see your stats.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/signup')}>
              Create Account
            </Button>
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </Box>
        </Card>
      )}

      <Typography variant="h6" gutterBottom>Currently Reading</Typography>

      {readingList.length === 0 ? (
        <Card sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            No books in your reading list yet.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Discover Books
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {readingList.map((book) => {
            const progress = book.pages && book.currentPage
              ? Math.min((book.currentPage / book.pages) * 100, 100)
              : 0;

            return (
              <Card
                key={book.id}
                sx={{
                  width: 180,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  '&:hover .book-actions': { opacity: 1 },
                }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <Box
                  component="img"
                  src={book.coverUrl || 'https://via.placeholder.com/180x240?text=No+Cover'}
                  alt={book.title}
                  sx={{ width: '100%', height: 240, objectFit: 'cover' }}
                />

                <Box
                  className="book-actions"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    display: 'flex',
                    gap: 0.5,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenProgress(e, book)}
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromReadingList(book.id, user?.id);
                    }}
                    sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {book.authors?.[0] || 'Unknown author'}
                  </Typography>
                  {book.currentPage > 0 && (
                    <Typography variant="caption" display="block" color="primary.main" fontWeight={600}>
                      Page {book.currentPage}{book.pages ? ` / ${book.pages}` : ''}
                    </Typography>
                  )}
                  {progress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ mt: 0.5, borderRadius: 1, height: 4 }}
                    />
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {user && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Reading Goal</Typography>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {booksFinished} / 12 books in 2026
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((booksFinished / 12) * 100, 100)}
                sx={{ mt: 1, borderRadius: 1, height: 6 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Quick Stats</Typography>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2">{booksFinished} books finished</Typography>
              <Typography variant="body2">{booksStarted} books in progress</Typography>
              <Typography variant="body2">{totalPages} pages read</Typography>
              <Typography variant="body2">{readingList.length} books in list</Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={progressDialog.open}
        onClose={() => setProgressDialog({ open: false, book: null })}
      >
        <DialogTitle>Update Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {progressDialog.book?.title}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Current page number"
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            inputProps={{ min: 0 }}
          />
          {progressDialog.book?.pages && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Total pages: {progressDialog.book.pages}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog({ open: false, book: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProgress}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
