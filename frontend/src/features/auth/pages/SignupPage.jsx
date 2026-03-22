import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      setSuccess('Account created! Check your email to confirm, then log in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, width: 400, maxWidth: '90vw' }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Display Name"
        margin="normal"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
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
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" onClick={() => navigate('/login')}>
          Already have an account? Log in
        </Link>
      </Box>
    </Card>
  );
}
