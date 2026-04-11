import {
  Box, Typography, Avatar, Card, Button, LinearProgress, Chip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROFILES } from '../data/mockProfiles';
import useSocialStore from '../../../store/socialStore';
import useAuthStore from '../../../store/authStore';
import useActivityStore, {
  calcCurrentStreak, calcLongestStreak, calcDaysLogged, calcTotalPages,
} from '../../../store/activityStore';
import ActivityChart from '../../../components/common/ActivityChart';

const STATUS_LABEL = {
  finished: 'Finished',
  reading: 'Reading',
  want_to_read: 'Want to Read',
};

const STATUS_COLOR = {
  finished: 'success',
  reading: 'primary',
  want_to_read: 'default',
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isFollowing = useSocialStore((s) => s.isFollowing);
  const follow = useSocialStore((s) => s.follow);
  const unfollow = useSocialStore((s) => s.unfollow);

  const profile = MOCK_PROFILES.find((p) => p.id === userId);

  // All hooks must be called unconditionally before any early return
  const fullActivityMap = useActivityStore((s) => s.activityMap);
  const activityMap = fullActivityMap[profile?.id] || {};
  const streak = calcCurrentStreak(activityMap);
  const longestStreak = calcLongestStreak(activityMap);
  const daysLogged = calcDaysLogged(activityMap);
  const totalPages = calcTotalPages(activityMap);

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" gutterBottom>User not found</Typography>
        <Button onClick={() => navigate('/social')}>Back to Find Readers</Button>
      </Box>
    );
  }

  const following = isFollowing(profile.id);
  const booksFinished = profile.readingList.filter((b) => b.status === 'finished').length;
  const booksReading = profile.readingList.filter((b) => b.status === 'reading').length;

  const handleFollow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (following) {
      unfollow(profile.id);
    } else {
      follow(profile.id);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/social')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Find Readers
      </Button>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
          {profile.displayName.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight={700}>{profile.displayName}</Typography>
            <Button
              variant={following ? 'outlined' : 'contained'}
              size="small"
              startIcon={following ? <CheckIcon /> : <PersonAddIcon />}
              onClick={handleFollow}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {profile.bio}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {profile.readingList.length} Books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booksFinished} Finished
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booksReading} Reading Now
            </Typography>
            {streak > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2" color="warning.main" fontWeight={700}>
                  {streak} day streak
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ p: 2, flex: 1, minWidth: 140 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">{booksFinished}</Typography>
          <Typography variant="body2" color="text.secondary">Books Finished</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 140 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">{totalPages.toLocaleString()}</Typography>
          <Typography variant="body2" color="text.secondary">Pages Read</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 140 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 28, color: 'warning.main' }} />
            <Typography variant="h4" fontWeight={700} color="warning.main">{streak}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">Day Streak</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 140 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">{longestStreak}</Typography>
          <Typography variant="body2" color="text.secondary">Longest Streak</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 140 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">{daysLogged}</Typography>
          <Typography variant="body2" color="text.secondary">Days Logged</Typography>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Reading Activity</Typography>
        <Card sx={{ p: 2 }}>
          <ActivityChart activityMap={activityMap} />
        </Card>
      </Box>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Reading List
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {profile.readingList.map((book) => {
          const progress = book.pages && book.currentPage
            ? Math.min((book.currentPage / book.pages) * 100, 100)
            : 0;

          return (
            <Card
              key={book.id}
              sx={{
                width: 180,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
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
              <Box sx={{ p: 1.5 }}>
                <Chip
                  label={STATUS_LABEL[book.status]}
                  color={STATUS_COLOR[book.status]}
                  size="small"
                  sx={{ mb: 0.5, fontSize: 10 }}
                />
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
    </Box>
  );
}
