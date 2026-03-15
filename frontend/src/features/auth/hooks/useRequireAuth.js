import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

export default function useRequireAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return { user, loading };
}
