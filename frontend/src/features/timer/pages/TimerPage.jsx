import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Card, MenuItem, Select,
  FormControl, InputLabel, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import useBookStore from '../../../store/bookStore';
import useAuthStore from '../../../store/authStore';
import useActivityStore from '../../../store/activityStore';

const PRESETS = [
  { label: '15 min', value: 15 * 60 },
  { label: '25 min', value: 25 * 60 },
  { label: '30 min', value: 30 * 60 },
  { label: '45 min', value: 45 * 60 },
  { label: '60 min', value: 60 * 60 },
];

function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerPage() {
  const user = useAuthStore((s) => s.user);
  const readingList = useBookStore((s) => s.readingList);
  const logSession = useActivityStore((s) => s.logSession);
  const setActiveSession = useActivityStore((s) => s.setActiveSession);
  const clearActiveSession = useActivityStore((s) => s.clearActiveSession);

  const [bookId, setBookId] = useState('');
  const [duration, setDuration] = useState(25 * 60);
  const [customMin, setCustomMin] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [doneDialog, setDoneDialog] = useState(false);
  const [pagesInput, setPagesInput] = useState('');
  const intervalRef = useRef(null);

  const book = readingList.find((b) => b.id === bookId);
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;
  const started = elapsed > 0 || running;

  // Sync timeLeft when duration changes (only if not started)
  useEffect(() => {
    if (!started) {
      setTimeLeft(duration);
      setElapsed(0);
    }
  }, [duration]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDoneDialog(true);
            if (user) clearActiveSession(user.id);
            setElapsed((e) => e + 1);
            return 0;
          }
          setElapsed((e) => e + 1);
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => {
    if (!bookId) return;
    setRunning(true);
    if (user && book) setActiveSession(user.id, book.title);
  };

  const handlePause = () => setRunning(false);

  const handleStop = () => {
    setRunning(false);
    setTimeLeft(duration);
    setElapsed(0);
    if (user) clearActiveSession(user.id);
  };

  const handlePreset = (val) => {
    if (started) return;
    setDuration(val);
    setTimeLeft(val);
    setElapsed(0);
  };

  const handleCustomSet = () => {
    const mins = parseInt(customMin, 10);
    if (!isNaN(mins) && mins > 0) {
      handlePreset(mins * 60);
      setCustomMin('');
    }
  };

  const handleLogAndClose = () => {
    const pages = parseInt(pagesInput, 10);
    if (user && book && !isNaN(pages) && pages > 0) {
      const dn = user.user_metadata?.display_name || user.email || '';
      logSession(user.id, dn, '', book.title, pages);
    }
    setDoneDialog(false);
    setPagesInput('');
    setTimeLeft(duration);
    setElapsed(0);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Focus Timer</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Pick a book, set your time, and focus. Your session will show in Friends Activity.
      </Typography>

      {/* Book picker */}
      <FormControl fullWidth sx={{ mb: 3, textAlign: 'left' }} disabled={started}>
        <InputLabel>What are you reading?</InputLabel>
        <Select value={bookId} label="What are you reading?" onChange={(e) => setBookId(e.target.value)}>
          {readingList.length === 0 ? (
            <MenuItem disabled value="">Add books to your reading list first</MenuItem>
          ) : (
            readingList.map((b) => (
              <MenuItem key={b.id} value={b.id}>{b.title}</MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* Duration presets */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
        {PRESETS.map((p) => (
          <Chip
            key={p.value}
            label={p.label}
            onClick={() => handlePreset(p.value)}
            color={duration === p.value ? 'primary' : 'default'}
            variant={duration === p.value ? 'filled' : 'outlined'}
            disabled={started}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
        <TextField
          size="small"
          placeholder="Custom (min)"
          type="number"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          disabled={started}
          sx={{ width: 140 }}
          inputProps={{ min: 1 }}
        />
        <Button variant="outlined" size="small" onClick={handleCustomSet} disabled={started}>
          Set
        </Button>
      </Box>

      {/* Timer card */}
      <Card
        sx={{
          p: 5, mb: 4,
          background: running
            ? 'linear-gradient(135deg, #5B4FCF 0%, #7C3AED 100%)'
            : 'background.paper',
          transition: 'background 0.4s ease',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '5.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            color: running ? 'white' : 'text.primary',
            mb: 1,
          }}
        >
          {fmt(timeLeft)}
        </Typography>

        {book ? (
          <Typography
            variant="body2"
            sx={{ color: running ? 'rgba(255,255,255,0.8)' : 'text.secondary', mb: 2.5 }}
          >
            {running ? 'Reading' : 'Ready'}: {book.title}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: running ? 'rgba(255,255,255,0.5)' : 'text.disabled', mb: 2.5 }}>
            No book selected
          </Typography>
        )}

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            borderRadius: 1, height: 5,
            bgcolor: running ? 'rgba(255,255,255,0.2)' : 'grey.200',
            '& .MuiLinearProgress-bar': { bgcolor: running ? 'white' : 'primary.main' },
          }}
        />
      </Card>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {!running && !started && (
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={handleStart}
            disabled={!bookId}
            sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
          >
            Start Reading
          </Button>
        )}
        {!running && started && timeLeft > 0 && (
          <>
            <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleStart}>
              Resume
            </Button>
            <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={handleStop}>
              Stop
            </Button>
          </>
        )}
        {running && (
          <>
            <Button variant="outlined" startIcon={<PauseIcon />} onClick={handlePause}>
              Pause
            </Button>
            <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={handleStop}>
              Stop
            </Button>
          </>
        )}
      </Box>

      {!user && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Log in to save sessions and share live reading activity with friends.
        </Typography>
      )}

      {/* Session complete dialog */}
      <Dialog open={doneDialog} onClose={() => setDoneDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Session Complete!</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Great work on <strong>{book?.title}</strong>. How many pages did you read?
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Pages read"
            type="number"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDoneDialog(false); setTimeLeft(duration); setElapsed(0); }}>
            Skip
          </Button>
          <Button variant="contained" onClick={handleLogAndClose} disabled={!user}>
            {user ? 'Log Session' : 'Log in to save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
