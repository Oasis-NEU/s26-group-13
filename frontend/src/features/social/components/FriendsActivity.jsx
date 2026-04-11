import { Box, Typography, Avatar, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSocialStore from '../../../store/socialStore';
import useActivityStore from '../../../store/activityStore';
import useAuthStore from '../../../store/authStore';
import { MOCK_PROFILES } from '../data/mockProfiles';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function FriendsActivity() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const following = useSocialStore((s) => s.following);
  const sessions = useActivityStore((s) => s.sessions);
  const activeSessions = useActivityStore((s) => s.activeSessions);

  const userActiveBook = user ? activeSessions[user.id] : null;
  const activeFriendEntries = Object.entries(activeSessions).filter(
    ([id]) => following.includes(id)
  );
  const friendSessions = sessions
    .filter((s) => following.includes(s.userId))
    .slice(0, 8);

  const displayName = user?.user_metadata?.display_name || user?.email || '';

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700}>Friends Activity</Typography>
      </Box>

      {/* Current user's live timer session */}
      {userActiveBook && (
        <Box
          sx={{
            px: 2, py: 1,
            bgcolor: 'primary.50',
            borderBottom: '1px solid', borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12 }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" fontWeight={600}>You</Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                Reading {userActiveBook}
              </Typography>
            </Box>
            <Chip label="Live" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />
          </Box>
        </Box>
      )}

      {/* Friends' live sessions */}
      {activeFriendEntries.map(([userId, bookTitle]) => {
        const profile = MOCK_PROFILES.find((p) => p.id === userId);
        if (!profile) return null;
        return (
          <Box
            key={userId}
            sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: 12 }}>
                {profile.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" fontWeight={600}>{profile.displayName}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  Reading {bookTitle}
                </Typography>
              </Box>
              <Chip label="Live" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />
            </Box>
          </Box>
        );
      })}

      {/* Recent session history */}
      <Box sx={{ px: 2 }}>
        {following.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontSize: 13 }}>
            Follow readers on the Social tab to see their activity here.
          </Typography>
        ) : friendSessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontSize: 13 }}>
            No recent activity yet.
          </Typography>
        ) : (
          friendSessions.map((session) => (
            <Box
              key={session.id}
              onClick={() => navigate(`/social/${session.userId}`)}
              sx={{
                display: 'flex', gap: 1.5, py: 1.25,
                cursor: 'pointer',
                borderBottom: '1px solid', borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { opacity: 0.7 },
              }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12, flexShrink: 0, mt: 0.25 }}>
                {session.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>{session.displayName}</Typography>
                  <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>
                    · {timeAgo(session.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  read {session.pagesRead}p ·{' '}
                  <Box component="span" sx={{ fontStyle: 'italic' }}>
                    {session.bookTitle}
                  </Box>
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
