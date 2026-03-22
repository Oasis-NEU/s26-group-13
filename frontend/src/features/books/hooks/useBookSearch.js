import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '../../../services/bookApi';
import useDebounce from '../../../hooks/useDebounce';

export default function useBookSearch(query) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: ['bookSearch', debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
