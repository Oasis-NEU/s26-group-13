import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import HomePage from '../features/books/HomePage';
import BookDetailsPage from '../features/books/BookDetailsPage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ProfilePage from '../features/profile/ProfilePage';
import LibraryPage from '../features/library/LibraryPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/book/:id', element: <BookDetailsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/library', element: <LibraryPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
]);