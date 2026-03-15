import { Box, Card, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Card sx={{ p: 4, width: 400, maxWidth: '90vw' }}>
      <Typography variant="h5" gutterBottom>Log In</Typography>
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Password" type="password" margin="normal" />
      <Button fullWidth variant="contained" sx={{ mt: 2 }}>Log In</Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" onClick={() => navigate('/signup')}>
          Don't have an account? Sign up
        </Link>
      </Box>
    </Card>
  );
}
