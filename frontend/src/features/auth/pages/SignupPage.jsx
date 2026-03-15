import { Box, Card, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <Card sx={{ p: 4, width: 400, maxWidth: '90vw' }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <TextField fullWidth label="Display Name" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Password" type="password" margin="normal" />
      <Button fullWidth variant="contained" sx={{ mt: 2 }}>Create Account</Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" onClick={() => navigate('/login')}>
          Already have an account? Log in
        </Link>
      </Box>
    </Card>
  );
}
