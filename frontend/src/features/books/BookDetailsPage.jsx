import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { Typography } from '@mui/material';

export default function BookDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <PageHeader title="Book Details" />
      <Typography color="text.secondary">Showing book ID: {id}</Typography>
    </div>
  );
}
