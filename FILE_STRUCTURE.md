# File Structure — S26-GROUP-13

```
S26-GROUP-13
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── app/                        # App entry, routing, providers, theme
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   ├── providers.jsx
│   │   │   ├── router.jsx
│   │   │   └── theme.js
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/                 # Shared UI components
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── PageHeader.jsx
│   │   │   └── ui/                     # (empty — reserved for base UI primitives)
│   │   ├── data/                       # (empty — reserved for static/seed data)
│   │   ├── features/                   # Feature-sliced modules
│   │   │   ├── auth/
│   │   │   │   ├── api/                # (empty)
│   │   │   │   ├── components/         # (empty)
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useRequireAuth.js
│   │   │   │   └── pages/
│   │   │   │       ├── LoginPage.jsx
│   │   │   │       └── SignupPage.jsx
│   │   │   ├── books/
│   │   │   │   ├── components/
│   │   │   │   │   └── BookCard.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useBookSearch.js
│   │   │   │   ├── BookDetailsPage.jsx
│   │   │   │   └── HomePage.jsx
│   │   │   ├── library/
│   │   │   │   └── LibraryPage.jsx
│   │   │   ├── profile/
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── social/                 # (empty)
│   │   │   ├── stats/                  # (empty)
│   │   │   └── timer/                  # (empty)
│   │   ├── hooks/                      # Shared hooks
│   │   │   └── useDebounce.js
│   │   ├── layouts/                    # Page layout wrappers
│   │   │   ├── AuthLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── services/                   # External API + Supabase clients
│   │   │   ├── bookApi.js              # Open Library API calls
│   │   │   ├── libraryApi.js           # Supabase DB calls (user_books, books)
│   │   │   ├── queryClient.js          # React Query client setup
│   │   │   └── supabaseClient.js       # Supabase client init
│   │   ├── store/                      # Zustand global state
│   │   │   ├── authStore.js
│   │   │   └── bookStore.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/                      # (empty — reserved for helper functions)
│   │   ├── App.css
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── .gitignore
├── package-lock.json
└── package.json
```
