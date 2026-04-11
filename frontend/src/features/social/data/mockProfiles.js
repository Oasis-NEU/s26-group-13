export const MOCK_PROFILES = [
  {
    id: 'mock-user-alex',
    displayName: 'Alex Rivera',
    username: 'alexreads',
    bio: 'Sci-fi & fantasy nerd. Reading through the classics one book at a time.',
    readingList: [
      {
        id: 'OL45804W', title: 'Dune', authors: ['Frank Herbert'],
        status: 'finished', coverUrl: null, pages: 412, currentPage: 412,
      },
      {
        id: 'OL27258W', title: "Ender's Game", authors: ['Orson Scott Card'],
        status: 'reading', coverUrl: null, pages: 324, currentPage: 180,
      },
      {
        id: 'OL82563W', title: 'Foundation', authors: ['Isaac Asimov'],
        status: 'want_to_read', coverUrl: null, pages: 255, currentPage: 0,
      },
      {
        id: 'OL98765W', title: "The Hitchhiker's Guide to the Galaxy", authors: ['Douglas Adams'],
        status: 'finished', coverUrl: null, pages: 224, currentPage: 224,
      },
    ],
  },
  {
    id: 'mock-user-jordan',
    displayName: 'Jordan Kim',
    username: 'bookworm_j',
    bio: 'Fantasy and mystery. Always reading two books at once.',
    readingList: [
      {
        id: 'OL80841W', title: 'The Name of the Wind', authors: ['Patrick Rothfuss'],
        status: 'finished', coverUrl: null, pages: 662, currentPage: 662,
      },
      {
        id: 'OL262758W', title: 'Gone Girl', authors: ['Gillian Flynn'],
        status: 'finished', coverUrl: null, pages: 422, currentPage: 422,
      },
      {
        id: 'OL12345W', title: 'The Way of Kings', authors: ['Brandon Sanderson'],
        status: 'reading', coverUrl: null, pages: 1007, currentPage: 450,
      },
    ],
  },
  {
    id: 'mock-user-sam',
    displayName: 'Sam Chen',
    username: 'samreads',
    bio: 'Non-fiction nerd. Philosophy, science, history.',
    readingList: [
      {
        id: 'OL98493W', title: 'Sapiens', authors: ['Yuval Noah Harari'],
        status: 'finished', coverUrl: null, pages: 443, currentPage: 443,
      },
      {
        id: 'OL17347285W', title: 'Atomic Habits', authors: ['James Clear'],
        status: 'reading', coverUrl: null, pages: 320, currentPage: 200,
      },
      {
        id: 'OL11223W', title: 'Thinking, Fast and Slow', authors: ['Daniel Kahneman'],
        status: 'want_to_read', coverUrl: null, pages: 499, currentPage: 0,
      },
    ],
  },
];
