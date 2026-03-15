import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import Providers from './providers';
import { router } from './router';
import useAuthStore from '../store/authStore';

function AppInner() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <Providers>
      <AppInner />
    </Providers>
  );
}
