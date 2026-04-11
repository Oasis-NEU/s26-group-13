# Chapters

A social reading tracker web app. Search for books, track your reading progress, log reading sessions with a focus timer, and connect with other readers.

Live: [oasis-group13.vercel.app](https://oasis-group13.vercel.app)

## Features

- **Book Discovery** — Search millions of books via the Open Library API, browse trending titles, and view recently seen books
- **Reading List** — Add books to your personal shelf, track your current page, and see progress bars
- **Reading Timer** — Focus timer with presets (15, 25, 30, 45, 60 min) or custom duration; log pages read at the end of each session
- **Activity Tracking** — GitHub-style contribution heatmap showing daily reading activity, current streak, longest streak, and total pages
- **Social** — Discover other readers, follow them, view their profiles and reading lists, and see a live activity feed when friends are reading
- **Leaderboard** — Compete with friends across most books, most pages, longest streak, and days logged
- **Themes** — Default (white/purple), Dark, and Nature (cartoony forest background with floating nav) — preference saved across sessions

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| UI | Material UI v7 |
| State | Zustand v5 (with localStorage persistence) |
| Backend | Supabase (auth + PostgreSQL) |
| Data fetching | TanStack Query v5 |
| Routing | React Router v7 |
| Deployment | Vercel |

## Database Schema

Four tables in Supabase:

- **profiles** — `id`, `username`, `avatar_url`, `yearly_goal`, `daily_min_goal`
- **books** — `id`, `open_library_id`, `title`, `author`, `cover_url`, `page_count`, `published_year`, `genres`
- **user_books** — `id`, `user_id`, `book_id`, `status`, `rating`, `current_page`, `date_started`, `date_finished`
- **reading_sessions** — `id`, `user_id`, `user_book_id`, `duration_mins`, `started_at`

## Getting Started

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

## Project Structure

```
frontend/src/
  app/           # Router, providers, theme definitions
  components/    # Shared UI (Navbar, ActivityChart, ForestBackground, etc.)
  features/
    books/       # Home page, book details, book search
    auth/        # Login and signup pages
    profile/     # User profile with stats and reading list
    social/      # Discover, friends, leaderboard, user profiles
    timer/       # Focus reading timer
    library/     # Full library view
  services/      # Supabase client, Open Library API, React Query client
  store/         # Zustand stores (auth, books, activity, social, theme, toast)
  layouts/       # MainLayout (handles theme branching), AuthLayout
```
