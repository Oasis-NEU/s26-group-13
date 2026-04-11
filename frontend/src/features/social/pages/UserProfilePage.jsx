import {
  Box, Typography, Avatar, Card, Button, LinearProgress, Chip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MOCK_PROFILES } from '../data/mockProfiles';
import { fetchProfileById, fetchUserBooksById } from '../../../services/libraryApi';
import useSocialStore from '../../../store/socialStore';
import useAuthStore from '../../../store/authStore';
import useActivityStore, {
  calcCurrentStreak, calcLongestStreak, calcDaysLogged, calcTotalPages,
} from '../../../store/activityStore';
import ActivityChart from '../../../components/common/ActivityChart';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const STATUS_LABEL = { finished: 'Finished', reading: 'Reading', want_to_read: 'Want to Read' };
const STATUS_COLOR = { finished: 'success', reading: 'primary', want_to_read: 'default' };

function BookGrid({ books }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {books.map((book) => {
        const progress = book.pages && book.currentPage
          ? Math.min((book.currentPage / book.pages) * 100, 100) : 0;
        return (
          <Card key={book.id} sx={{ width: 160, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            {book.coverUrl ? (
              <Box component="img" src={book.coverUrl} alt={book.title}
                sx={{ width: '100%', height: 220, objectFit: 'cover' }} />
            ) : (
              <Box sx={{ width: '100%', height: 220, bgcolor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, opacity: 0.6 }}>
                  {book.title.charAt(0).toUpperCase()}
                </Typography>
              </Box>
            )}
            <Box sx={{ p: 1.5 }}>
              {book.status && (
                <Chip label={STATUS_LABEL[book.status] || book.status} color={STATUS_COLOR[book.status] || 'default'}
                  size="small" sx={{ mb: 0.5, fontSize: 10 }} />
              )}
              <Typography variant="body2" fontWeight={600} noWrap>{book.title}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {book.authors?.[0] || book.author || 'Unknown author'}
              </Typography>
              {book.currentPage > 0 && (
                <Typography variant="caption" display="block" color="primary.main" fontWeight={600}>
                  Page {book.currentPage}{book.pages ? ` / ${book.pages}` : ''}
                </Typography>
              )}
              {progress > 0 && (
                <LinearProgress variant="determinate" value={progress}
                  sx={{ mt: 0.5, borderRadius: 1, height: 4 }} />
              )}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}

function StatCards({ booksFinished, totalPages, streak, longestStreak, daysLogged }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
      <Card sx={{ p: 2, flex: 1, minWidth: 120 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">{booksFinished}</Typography>
        <Typography variant="body2" color="text.secondary">Books Finished</Typography>
      </Card>
      <Card sx={{ p: 2, flex: 1, minWidth: 120 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">{totalPages.toLocaleString()}</Typography>
        <Typography variant="body2" color="text.secondary">Pages Read</Typography>
      </Card>
      <Card sx={{ p: 2, flex: 1, minWidth: 120 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 28, color: 'warning.main' }} />
          <Typography variant="h4" fontWeight={700} color="warning.main">{streak}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Day Streak</Typography>
      </Card>
      <Card sx={{ p: 2, flex: 1, minWidth: 120 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">{longestStreak}</Typography>
        <Typography variant="body2" color="text.secondary">Longest Streak</Typography>
      </Card>
      <Card sx={{ p: 2, flex: 1, minWidth: 120 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">{daysLogged}</Typography>
        <Typography variant="body2" color="text.secondary">Days Logged</Typography>
      </Card>
    </Box>
  );
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const following = useSocialStore((s) => s.following.includes(userId));
  const follow = useSocialStore((s) => s.follow);
  const unfollow = useSocialStore((s) => s.unfollow);

  // All activity hooks unconditionally
  const fullActivityMap = useActivityStore((s) => s.activityMap);
  const activityMap = fullActivityMap[userId] || {};
  const streak = calcCurrentStreak(activityMap);
  const longestStreak = calcLongestStreak(activityMap);
  const daysLogged = calcDaysLogged(activityMap);
  const totalPages = calcTotalPages(activityMap);

  const mockProfile = MOCK_PROFILES.find((p) => p.id === userId);

  // Only fetch from Supabase if it's not a mock profile
  const { data: realProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfileById(userId),
    enabled: !mockProfile,
    retry: false,
  });

  const { data: realBooks = [] } = useQuery({
    queryKey: ['userBooks', userId],
    queryFn: () => fetchUserBooksById(userId),
    enabled: !mockProfile && !!realProfile,
  });

  const handleFollow = () => {
    if (!user) { navigate('/login'); return; }
    following ? unfollow(userId) : follow(userId);
  };

  const followButton = (
    <Button
      variant={following ? 'outlined' : 'contained'}
      size="small"
      startIcon={following ? <CheckIcon /> : <PersonAddIcon />}
      onClick={handleFollow}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );

  const backButton = (
    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/social')}
      sx={{ mb: 3, color: 'text.secondary' }}>
      Find Readers
    </Button>
  );

  // ── Mock profile ─────────────────────────────────────────────────────────────
  if (mockProfile) {
    const booksFinished = mockProfile.readingList.filter((b) => b.status === 'finished').length;
    const mockBooks = mockProfile.readingList.map((b) => ({
      ...b, authors: b.authors, currentPage: b.currentPage, pages: b.pages,
    }));

    return (
      <Box>
        {backButton}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
            {mockProfile.displayName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h5" fontWeight={700}>{mockProfile.displayName}</Typography>
              {followButton}
            </Box>
            <Typography variant="body2" color="text.secondary">@{mockProfile.username}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{mockProfile.bio}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">{mockProfile.readingList.length} Books</Typography>
              <Typography variant="body2" color="text.secondary">{booksFinished} Finished</Typography>
              {streak > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="body2" color="warning.main" fontWeight={700}>{streak} day streak</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <StatCards booksFinished={booksFinished} totalPages={totalPages}
          streak={streak} longestStreak={longestStreak} daysLogged={daysLogged} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Reading Activity</Typography>
          <Card sx={{ p: 2 }}><ActivityChart activityMap={activityMap} /></Card>
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>Reading List</Typography>
        <BookGrid books={mockBooks} />
      </Box>
    );
  }

  // ── Real user profile ─────────────────────────────────────────────────────────
  if (loadingProfile) return <LoadingSpinner />;

  if (!realProfile) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" gutterBottom>User not found</Typography>
        <Button onClick={() => navigate('/social')}>Back to Find Readers</Button>
      </Box>
    );
  }

  const displayName = realProfile.username || 'Unknown User';
  const realBooksFormatted = realBooks.map((ub) => ({
    id: ub.books?.open_library_id || ub.id,
    title: ub.books?.title || 'Unknown',
    author: ub.books?.author || null,
    coverUrl: ub.books?.cover_url || null,
    currentPage: ub.current_page || 0,
    pages: ub.books?.page_count || null,
    status: ub.status,
  }));
  const booksFinished = realBooksFormatted.filter((b) => b.status === 'finished').length;

  return (
    <Box>
      {backButton}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: 32 }}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight={700}>{displayName}</Typography>
            {user?.id !== userId && followButton}
          </Box>
          <Typography variant="body2" color="text.secondary">@{displayName}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {realBooksFormatted.length > 0 && (
              <Typography variant="body2" color="text.secondary">{realBooksFormatted.length} Books</Typography>
            )}
            {streak > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2" color="warning.main" fontWeight={700}>{streak} day streak</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <StatCards booksFinished={booksFinished} totalPages={totalPages}
        streak={streak} longestStreak={longestStreak} daysLogged={daysLogged} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Reading Activity</Typography>
        <Card sx={{ p: 2 }}><ActivityChart activityMap={activityMap} /></Card>
      </Box>

      {realBooksFormatted.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom>Reading List</Typography>
          <BookGrid books={realBooksFormatted} />
        </>
      )}
    </Box>
  );
}
