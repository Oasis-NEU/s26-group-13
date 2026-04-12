import { create } from 'zustand';
import {
  fetchUserBooks,
  addBookToLibrary,
  removeBookFromLibrary,
  updateBookProgress,
  updateBookStatus,
  setBookFavorite,
  updateBookPageCount,
} from '../services/libraryApi';
import { fetchPageCount } from '../services/bookApi';
import useActivityStore from './activityStore';

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
      isFavorite: ub.is_favorite || false,
    }));
    set({ readingList });

    // Background: fill in missing page counts from OpenLibrary
    readingList
      .filter((b) => !b.pages)
      .forEach(async (book) => {
        const pages = await fetchPageCount(book.id);
        if (pages) get().setPageCount(book.id, pages);
      });
  },

  clearReadingList: () => set({ readingList: [] }),

  addToReadingList: async (book, userId, status = 'reading') => {
    const exists = get().readingList.find((b) => b.id === book.id);
    if (exists) return;

    if (userId) {
      try {
        const { userBook } = await addBookToLibrary(userId, book, status);
        set({
          readingList: [
            ...get().readingList,
            { ...book, currentPage: 0, isFavorite: false, status, userBookId: userBook.id },
          ],
        });
      } catch (err) {
        console.error('Failed to save book to database:', err);
        set({ readingList: [...get().readingList, { ...book, currentPage: 0, isFavorite: false, status }] });
      }
    } else {
      set({ readingList: [...get().readingList, { ...book, currentPage: 0, isFavorite: false, status }] });
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
    const book = get().readingList.find((b) => b.id === bookId);
    const oldPage = book?.currentPage || 0;
    const delta = page - oldPage;

    if (userId) {
      if (book?.userBookId) {
        await updateBookProgress(book.userBookId, page);
      }
      if (delta > 0) {
        useActivityStore.getState().logPageUpdate(userId, delta);
      }
    }
    set({
      readingList: get().readingList.map((b) =>
        b.id === bookId ? { ...b, currentPage: page } : b
      ),
    });
  },

  updateStatus: async (bookId, status, userId) => {
    if (userId) {
      const book = get().readingList.find((b) => b.id === bookId);
      if (book?.userBookId) {
        await updateBookStatus(book.userBookId, status);
      }
    }
    set({
      readingList: get().readingList.map((b) => (b.id === bookId ? { ...b, status } : b)),
    });
  },

  toggleFavorite: async (bookId, userId) => {
    const book = get().readingList.find((b) => b.id === bookId);
    const newVal = !book?.isFavorite;
    if (userId && book?.userBookId) {
      await setBookFavorite(book.userBookId, newVal);
    }
    set({
      readingList: get().readingList.map((b) => (b.id === bookId ? { ...b, isFavorite: newVal } : b)),
    });
  },

  setPageCount: (bookId, pages) => {
    set({
      readingList: get().readingList.map((b) => (b.id === bookId ? { ...b, pages } : b)),
    });
    updateBookPageCount(bookId, pages);
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
