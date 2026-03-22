import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import useBookStore from '../../../store/bookStore';

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const addToReadingList = useBookStore((s) => s.addToReadingList);
  const isInReadingList = useBookStore((s) => s.isInReadingList);
  const addToHistory = useBookStore((s) => s.addToHistory);
  const alreadyAdded = isInReadingList(book.id);

  const handleClick = () => {
    addToHistory(book);
    navigate(`/book/${book.id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToReadingList(book);
  };

  return (
    <Card
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: 180,
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      {hovered && (
        <Tooltip title={alreadyAdded ? 'Already in reading list' : 'Add to reading list'}>
          <IconButton
            onClick={handleAdd}
            disabled={alreadyAdded}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: alreadyAdded ? 'success.main' : 'primary.main',
              color: 'white',
              zIndex: 2,
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: alreadyAdded ? 'success.dark' : 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'success.main',
                color: 'white',
              },
            }}
          >
            {alreadyAdded ? <CheckIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )}

      <CardMedia
        component="img"
        height="240"
        image={book.coverUrl || 'https://via.placeholder.com/180x240?text=No+Cover'}
        alt={book.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {book.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {book.authors?.[0] || 'Unknown author'}
        </Typography>
        {book.firstPublishYear && (
          <Typography variant="caption" display="block" color="text.secondary">
            {book.firstPublishYear}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
