import { useState } from 'react';
import {
  Avatar, Box, Typography, Card, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, LinearProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useBookStore from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import useActivityStore, { calcCurrentStreak } from '../../store/activityStore';
import useToastStore from '../../store/toastStore';
import ActivityChart from '../../components/common/ActivityChart';
import { getFollowCounts } from '../../services/libraryApi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const readingList = useBookStore((s) => s.readingList);
  const removeFromReadingList = useBookStore((s) => s.removeFromReadingList);
  const updateProgress = useBookStore((s) => s.updateProgress);
  const showToast = useToastStore((s) => s.showToast);

  const updateStatus = useBookStore((s) => s.updateStatus);
  const [progressDialog, setProgressDialog] = useState({ open: false, book: null });
  const [pageInput, setPageInput] = useState('');

  const fullActivityMap = useActivityStore((s) => s.activityMap);
  const activityMap = fullActivityMap[user?.id] || {};
  const streak = calcCurrentStreak(activityMap);

  const handleOpenProgress = (e, book) => {
    e.stopPropagation();
    setPageInput(book.currentPage?.toString() || '0');
    setProgressDialog({ open: true, book });
  };

  const handleSaveProgress = () => {
    const book = progressDialog.book;
    if (!book) return;

    let page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (book.pages && page > book.pages) page = book.pages;

    const previousPage = book.currentPage;
    const previousStatus = book.status;

    updateProgress(book.id, page, user?.id);

    if (book.pages && page >= book.pages) {
      updateStatus(book.id, 'finished', user?.id);
      showToast(
        `You finished "${book.title}"! Great job!`,
        'success',
        () => {
          updateProgress(book.id, previousPage, user?.id);
          updateStatus(book.id, previousStatus || 'reading', user?.id);
        }
      );
    }

    setProgressDialog({ open: false, book: null });
  };

  const totalPages = readingList.reduce((sum, b) => sum + (b.currentPage || 0), 0);
  const booksStarted = readingList.filter((b) => b.currentPage > 0).length;
  const booksFinished = readingList.filter(
    (b) => b.status === 'finished' || (b.pages && b.currentPage >= b.pages)
  ).length;

  const displayName = user?.user_metadata?.display_name || user?.email || 'Guest';

  const { data: followCounts } = useQuery({
    queryKey: ['followCounts', user?.id],
    queryFn: () => getFollowCounts(user.id),
    enabled: !!user,
  });

  return (
    <div>
      <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: user ? 'primary.main' : 'grey.300' }}>
          {user ? displayName.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Box>
          <Typography variant="h5">{user ? displayName : 'Guest'}</Typography>
          {user && (
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {readingList.length} Books
              </Typography>
              <Typography variant="body2" color="text.secondary">{followCounts?.following ?? '—'} Following</Typography>
              <Typography variant="body2" color="text.secondary">{followCounts?.followers ?? '—'} Followers</Typography>
              {streak > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="body2" color="warning.main" fontWeight={700}>
                    {streak} day streak
                  </Typography>
                </Box>
              )}
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

      {readingList.filter((b) => b.status === 'reading' || b.status === 'to_read').length === 0 ? (
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
          {readingList.filter((b) => b.status === 'reading' || b.status === 'to_read').map((book) => {
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
                      width: '100%', height: 240,
                      bgcolor: 'primary.main',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, opacity: 0.6 }}>
                      {book.title.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                )}

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
                  <Box sx={{ mt: 0.75 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ borderRadius: 1, height: 5 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                      {book.pages > 0
                        ? `${book.currentPage} / ${book.pages} pages`
                        : book.currentPage > 0
                          ? `Page ${book.currentPage}`
                          : 'No progress yet'}
                    </Typography>
                  </Box>
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

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Favorites</Typography>
            {(() => {
              const favorites = readingList.filter((b) => b.isFavorite).slice(0, 3);
              return favorites.length === 0 ? (
                <Card sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No favorites yet. Heart a book on its page to add it here.
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {favorites.map((book) => (
                    <Card
                      key={book.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, cursor: 'pointer' }}
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      {book.coverUrl ? (
                        <Box
                          component="img"
                          src={book.coverUrl}
                          alt={book.title}
                          sx={{ width: 38, height: 52, objectFit: 'cover', borderRadius: 0.5, flexShrink: 0 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 38, height: 52, bgcolor: 'primary.main', borderRadius: 0.5,
                            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                            {book.title.charAt(0)}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{book.title}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {book.authors?.[0] || 'Unknown author'}
                        </Typography>
                      </Box>
                      <FavoriteIcon sx={{ fontSize: 14, color: 'error.main', flexShrink: 0 }} />
                    </Card>
                  ))}
                </Box>
              );
            })()}
          </Grid>
        </Grid>
      )}

      {user && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Reading Activity</Typography>
          <Card sx={{ p: 2 }}>
            <ActivityChart activityMap={activityMap} />
          </Card>
        </Box>
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
            label="Current page"
            type="number"
            value={pageInput}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              const max = progressDialog.book?.pages;
              if (!isNaN(val) && max && val > max) {
                setPageInput(max.toString());
              } else {
                setPageInput(e.target.value);
              }
            }}
            inputProps={{ min: 0, max: progressDialog.book?.pages || undefined }}
            helperText={progressDialog.book?.pages ? `Out of ${progressDialog.book.pages} pages` : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog({ open: false, book: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProgress}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
