# Chapters

A social reading tracker — search books, track your progress, run focus timer sessions, and follow other readers.

**Live:** [oasis-group13.vercel.app](https://oasis-group13.vercel.app)

## Features

- **Book Discovery** — Search millions of books via Open Library, browse trending titles
- **Reading List** — Add books, track current page, view progress bars
- **Focus Timer** — Presets or custom duration; logs pages read at the end of each session
- **Activity Heatmap** — GitHub-style grid showing daily reading activity, current streak, longest streak
- **Social** — Discover and follow other readers, view their profiles and reading lists
- **Leaderboard** — Ranked by books finished, pages read, longest streak, or days logged
- **Themes** — Default (white/purple), Dark, and Nature (animated forest background with floating nav)

## Tech Stack

| | |
|---|---|
| Framework | React 19 + Vite 7 |
| UI | Material UI v7 |
| State | Zustand v5 |
| Backend | Supabase (auth + PostgreSQL) |
| Data fetching | TanStack Query v5 |
| Routing | React Router v7 |
| Deployment | Vercel |

## Getting Started

```bash
cd frontend
npm install
```

Add a `frontend/.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Source code is in the `frontend/` directory.
