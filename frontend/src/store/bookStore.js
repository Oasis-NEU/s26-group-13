import { create } from 'zustand';
import {
  fetchUserBooks,
  addBookToLibrary,
  removeBookFromLibrary,
  updateBookProgress,
} from '../services/libraryApi';

const useBookStore = create((set, get) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  readingList: [],

  loadUserBooks: async (userId) => {
    const data = await fetchUserBooks(userId);
    const readingList = data.map((ub) => ({
      id: ub.books.open_library_id,
      userBookId: ub.id,
      title: ub.books.title,
      authors: ub.books.author ? [ub.books.author] : [],
      coverUrl: ub.books.cover_url,
      pages: ub.books.page_count,
      firstPublishYear: ub.books.published_year,
      currentPage: ub.current_page || 0,
      status: ub.status,
    }));
    set({ readingList });
  },

  clearReadingList: () => set({ readingList: [] }),

  addToReadingList: async (book, userId) => {
    const exists = get().readingList.find((b) => b.id === book.id);
    if (exists) return;

    if (userId) {
      try {
        const { userBook } = await addBookToLibrary(userId, book);
        set({
          readingList: [...get().readingList, { ...book, currentPage: 0, userBookId: userBook.id }],
        });
      } catch (err) {
        console.error('Failed to save book to database:', err);
        set({ readingList: [...get().readingList, { ...book, currentPage: 0 }] });
      }
    } else {
      set({ readingList: [...get().readingList, { ...book, currentPage: 0 }] });
    }
  },

  removeFromReadingList: async (bookId, userId) => {
    if (userId) {
      const book = get().readingList.find((b) => b.id === bookId);
      if (book?.userBookId) {
        await removeBookFromLibrary(book.userBookId);
      }
    }
    set({ readingList: get().readingList.filter((b) => b.id !== bookId) });
  },

  updateProgress: async (bookId, page, userId) => {
    if (userId) {
      const book = get().readingList.find((b) => b.id === bookId);
      if (book?.userBookId) {
        await updateBookProgress(book.userBookId, page);
      }
    }
    set({
      readingList: get().readingList.map((b) =>
        b.id === bookId ? { ...b, currentPage: page } : b
      ),
    });
  },

  isInReadingList: (bookId) => {
    return get().readingList.some((b) => b.id === bookId);
  },

  viewHistory: [],
  addToHistory: (book) => {
    const filtered = get().viewHistory.filter((b) => b.id !== book.id);
    set({ viewHistory: [book, ...filtered].slice(0, 20) });
  },
}));

export default useBookStore;
