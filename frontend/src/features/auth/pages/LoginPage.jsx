import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Link, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, width: 400, maxWidth: '90vw' }}>
      <Typography variant="h5" gutterBottom>Log In</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" onClick={() => navigate('/signup')}>
          Don't have an account? Sign up
        </Link>
      </Box>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        onClick={() => navigate('/')}
      >
        Continue without an account
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
        You can browse and search books, but your reading list and stats won't be saved.
      </Typography>
    </Card>
  );
}
