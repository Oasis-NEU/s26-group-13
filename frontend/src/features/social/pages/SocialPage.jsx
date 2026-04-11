import { useState } from 'react';
import {
  Box, Typography, InputBase, Paper, Avatar, Card, Button, Chip,
  Tabs, Tab, LinearProgress, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MOCK_PROFILES } from '../data/mockProfiles';
import { fetchProfiles } from '../../../services/libraryApi';
import useSocialStore from '../../../store/socialStore';
import useActivityStore, {
  calcCurrentStreak, calcLongestStreak, calcDaysLogged, calcTotalPages,
} from '../../../store/activityStore';
import useAuthStore from '../../../store/authStore';
import useBookStore from '../../../store/bookStore';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Discover tab ────────────────────────────────────────────────────────────

function RealUserCard({ profile, user, navigate }) {
  const isFollowing = useSocialStore((s) => s.isFollowing);
  const follow = useSocialStore((s) => s.follow);
  const unfollow = useSocialStore((s) => s.unfollow);

  const following = isFollowing(profile.id);
  const displayName = profile.username || profile.id.slice(0, 8);
  const username = profile.username || profile.id.slice(0, 8);

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    following ? unfollow(profile.id) : follow(profile.id);
  };

  return (
    <Card
      sx={{
        p: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 },
      }}
    >
      <Avatar sx={{ width: 52, height: 52, bgcolor: 'secondary.main', fontSize: 20, flexShrink: 0 }}>
        {displayName.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={600}>{displayName}</Typography>
          <Chip label="Real user" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">@{username}</Typography>
      </Box>
      <Button
        variant={following ? 'outlined' : 'contained'}
        size="small"
        startIcon={following ? <CheckIcon /> : <PersonAddIcon />}
        onClick={handleFollow}
        sx={{ flexShrink: 0 }}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
    </Card>
  );
}

function DiscoverTab({ user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const isFollowing = useSocialStore((s) => s.isFollowing);
  const follow = useSocialStore((s) => s.follow);
  const unfollow = useSocialStore((s) => s.unfollow);
  const activityMap = useActivityStore((s) => s.activityMap);

  const { data: realProfiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => fetchProfiles('', user?.id),
    staleTime: 1000 * 60 * 2,
  });

  const filteredMocks = MOCK_PROFILES.filter((p) => {
    const q = query.toLowerCase();
    return p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
  });

  const filteredReal = realProfiles.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const name = (p.display_name || '').toLowerCase();
    const em = (p.email || '').toLowerCase();
    return name.includes(q) || em.includes(q);
  });

  const handleFollow = (e, id) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    isFollowing(id) ? unfollow(id) : follow(id);
  };

  const totalResults = filteredReal.length + filteredMocks.length;

  return (
    <Box>
      <Paper
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 2, py: 1, mb: 3, borderRadius: 2,
          border: '1px solid', borderColor: 'divider', boxShadow: 'none',
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary' }} />
        <InputBase
          fullWidth
          placeholder="Search by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loadingProfiles && <CircularProgress size={18} />}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Real Supabase users */}
        {filteredReal.map((profile) => (
          <RealUserCard key={profile.id} profile={profile} user={user} navigate={navigate} />
        ))}

        {/* Mock demo profiles */}
        {filteredMocks.map((profile) => {
          const following = isFollowing(profile.id);
          const streak = calcCurrentStreak(activityMap[profile.id] || {});
          const booksFinished = profile.readingList.filter((b) => b.status === 'finished').length;
          const booksReading = profile.readingList.filter((b) => b.status === 'reading').length;

          return (
            <Card
              key={profile.id}
              onClick={() => navigate(`/social/${profile.id}`)}
              sx={{
                p: 2.5, display: 'flex', alignItems: 'center', gap: 2,
                cursor: 'pointer', transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 3 },
              }}
            >
              <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', fontSize: 20, flexShrink: 0 }}>
                {profile.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={600}>{profile.displayName}</Typography>
                  <Chip label="Demo" size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>{profile.bio}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">{booksFinished} finished</Typography>
                  <Typography variant="caption" color="text.secondary">{booksReading} reading now</Typography>
                  {streak > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      <LocalFireDepartmentIcon sx={{ fontSize: 12, color: 'warning.main' }} />
                      <Typography variant="caption" color="warning.main" fontWeight={600}>
                        {streak}d streak
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Button
                variant={following ? 'outlined' : 'contained'}
                size="small"
                startIcon={following ? <CheckIcon /> : <PersonAddIcon />}
                onClick={(e) => handleFollow(e, profile.id)}
                sx={{ flexShrink: 0 }}
              >
                {following ? 'Following' : 'Follow'}
              </Button>
            </Card>
          );
        })}

        {!loadingProfiles && totalResults === 0 && (
          <Typography color="text.secondary">No users found for "{query}"</Typography>
        )}
      </Box>
    </Box>
  );
}

// ─── Friends tab ─────────────────────────────────────────────────────────────

function FriendsTab({ user }) {
  const navigate = useNavigate();
  const following = useSocialStore((s) => s.following);
  const unfollow = useSocialStore((s) => s.unfollow);
  const sessions = useActivityStore((s) => s.sessions);
  const activeSessions = useActivityStore((s) => s.activeSessions);
  const activityMap = useActivityStore((s) => s.activityMap);

  const friends = MOCK_PROFILES.filter((p) => following.includes(p.id));

  if (friends.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" gutterBottom>No friends yet</Typography>
        <Typography color="text.secondary">
          Go to Discover and follow some readers to see them here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {friends.map((profile) => {
        const streak = calcCurrentStreak(activityMap[profile.id] || {});
        const totalPages = calcTotalPages(activityMap[profile.id] || {});
        const booksFinished = profile.readingList.filter((b) => b.status === 'finished').length;
        const recentSessions = sessions.filter((s) => s.userId === profile.id).slice(0, 3);
        const isLive = Boolean(activeSessions[profile.id]);

        return (
          <Card key={profile.id} sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Avatar
                sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: 18, cursor: 'pointer' }}
                onClick={() => navigate(`/social/${profile.id}`)}
              >
                {profile.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    fontWeight={600} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={() => navigate(`/social/${profile.id}`)}
                  >
                    {profile.displayName}
                  </Typography>
                  {isLive && <Chip label="Reading now" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />}
                </Box>
                <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
              </Box>
              <Button
                size="small" variant="outlined" color="error"
                onClick={() => unfollow(profile.id)}
              >
                Unfollow
              </Button>
            </Box>

            {/* Stats row */}
            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">{booksFinished}</Typography>
                <Typography variant="caption" color="text.secondary">Books</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">{totalPages.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">Pages</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight={700} color="warning.main">{streak}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Day streak</Typography>
                </Box>
              </Box>
            </Box>

            {/* Recent activity */}
            {recentSessions.length > 0 && (
              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Recent Activity
                </Typography>
                {recentSessions.map((s) => (
                  <Typography key={s.id} variant="caption" color="text.secondary" display="block">
                    Read {s.pagesRead}p of <em>{s.bookTitle}</em> · {timeAgo(s.timestamp)}
                  </Typography>
                ))}
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
}

// ─── Leaderboard tab ─────────────────────────────────────────────────────────

const METRICS = [
  { key: 'booksFinished', label: 'Most Books' },
  { key: 'totalPages', label: 'Most Pages' },
  { key: 'longestStreak', label: 'Longest Streak' },
  { key: 'daysLogged', label: 'Days Logged' },
];

function LeaderboardTab({ user }) {
  const navigate = useNavigate();
  const [metric, setMetric] = useState('booksFinished');
  const readingList = useBookStore((s) => s.readingList);
  const activityMap = useActivityStore((s) => s.activityMap);

  const allUsers = [
    ...MOCK_PROFILES.map((p) => {
      const uMap = activityMap[p.id] || {};
      return {
        id: p.id,
        displayName: p.displayName,
        username: p.username,
        isMock: true,
        booksFinished: p.readingList.filter((b) => b.status === 'finished').length,
        totalPages: calcTotalPages(uMap),
        currentStreak: calcCurrentStreak(uMap),
        longestStreak: calcLongestStreak(uMap),
        daysLogged: calcDaysLogged(uMap),
      };
    }),
    ...(user
      ? [{
          id: user.id,
          displayName: user.user_metadata?.display_name || user.email || 'You',
          username: user.email?.split('@')[0] || 'you',
          isMock: false,
          booksFinished: readingList.filter((b) => b.status === 'finished').length,
          totalPages: calcTotalPages(activityMap[user.id] || {}),
          currentStreak: calcCurrentStreak(activityMap[user.id] || {}),
          longestStreak: calcLongestStreak(activityMap[user.id] || {}),
          daysLogged: calcDaysLogged(activityMap[user.id] || {}),
        }]
      : []),
  ];

  const sorted = [...allUsers].sort((a, b) => {
    if (metric === 'booksFinished') return b.booksFinished - a.booksFinished;
    if (metric === 'totalPages') return b.totalPages - a.totalPages;
    if (metric === 'longestStreak') return b.longestStreak - a.longestStreak;
    return b.daysLogged - a.daysLogged;
  });

  const getValue = (u) => {
    if (metric === 'booksFinished') return `${u.booksFinished} books`;
    if (metric === 'totalPages') return `${u.totalPages.toLocaleString()} pages`;
    if (metric === 'longestStreak') return `${u.longestStreak} days`;
    return `${u.daysLogged} days`;
  };

  const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {METRICS.map((m) => (
          <Chip
            key={m.key}
            label={m.label}
            onClick={() => setMetric(m.key)}
            color={metric === m.key ? 'primary' : 'default'}
            variant={metric === m.key ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sorted.map((u, i) => {
          const isCurrentUser = user && u.id === user.id;
          const maxVal = sorted[0] ? (
            metric === 'booksFinished' ? sorted[0].booksFinished :
            metric === 'totalPages' ? sorted[0].totalPages :
            metric === 'longestStreak' ? sorted[0].longestStreak :
            sorted[0].daysLogged
          ) : 1;
          const myVal = metric === 'booksFinished' ? u.booksFinished :
            metric === 'totalPages' ? u.totalPages :
            metric === 'longestStreak' ? u.longestStreak :
            u.daysLogged;
          const pct = maxVal > 0 ? (myVal / maxVal) * 100 : 0;

          return (
            <Card
              key={u.id}
              onClick={() => u.isMock ? navigate(`/social/${u.id}`) : null}
              sx={{
                p: 2,
                cursor: u.isMock ? 'pointer' : 'default',
                border: isCurrentUser ? '2px solid' : '1px solid',
                borderColor: isCurrentUser ? 'primary.main' : 'divider',
                '&:hover': u.isMock ? { boxShadow: 2 } : {},
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: '1.1rem', width: 28, textAlign: 'center',
                    color: RANK_COLORS[i] || 'text.secondary',
                  }}
                >
                  {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `${i + 1}th`}
                </Typography>
                <Avatar sx={{ width: 36, height: 36, bgcolor: isCurrentUser ? 'secondary.main' : 'primary.main', fontSize: 14 }}>
                  {u.displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600} variant="body2">
                    {u.displayName}{isCurrentUser && ' (You)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {i === 0 && <EmojiEventsIcon sx={{ fontSize: 18, color: '#FFD700' }} />}
                  <Typography fontWeight={700} color={i === 0 ? 'primary.main' : 'text.primary'}>
                    {getValue(u)}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{ borderRadius: 1, height: 4, bgcolor: 'grey.100' }}
              />
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SocialPage() {
  const [tab, setTab] = useState(0);
  const user = useAuthStore((s) => s.user);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Social</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Discover" />
        <Tab label="Friends" />
        <Tab label="Leaderboard" />
      </Tabs>

      {tab === 0 && <DiscoverTab user={user} />}
      {tab === 1 && <FriendsTab user={user} />}
      {tab === 2 && <LeaderboardTab user={user} />}
    </Box>
  );
}
