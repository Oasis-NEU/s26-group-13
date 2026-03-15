import { Avatar, Box, Typography, Card, Grid } from '@mui/material';

export default function ProfilePage() {
  return (
    <div>
      <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.300' }} />
        <Box>
          <Typography variant="h5">Profile Name</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">X Books</Typography>
            <Typography variant="body2" color="text.secondary">X Following</Typography>
            <Typography variant="body2" color="text.secondary">X Followers</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Bio</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography variant="h6" gutterBottom>Currently Reading</Typography>
          <Card sx={{ p: 3, mb: 3, bgcolor: '#C4A882', minHeight: 150 }}>
            <Typography color="white">Book cards here</Typography>
          </Card>

          <Typography variant="h6" gutterBottom>Favorite Books</Typography>
          <Card sx={{ p: 3, bgcolor: '#C4A882', minHeight: 150 }}>
            <Typography color="white">Favorite book cards here</Typography>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>Reading Goal</Typography>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">X books in 2026</Typography>
          </Card>

          <Typography variant="h6" gutterBottom>Quick Stats</Typography>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2">X books read this year</Typography>
            <Typography variant="body2">X minutes read this year</Typography>
            <Typography variant="body2">X pages read this year</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
