import PageHeader from '../../components/common/PageHeader';
import { Typography } from '@mui/material';

export default function HomePage() {
  return (
    <div>
      <PageHeader title="Home" subtitle="Discover your next read" />
      <Typography color="text.secondary">Book feed coming soon.</Typography>
    </div>
  );
}
