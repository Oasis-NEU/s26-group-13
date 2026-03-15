import { create } from 'zustand';

const useBookStore = create((set, get) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  readingList: [],
  addToReadingList: (book) => {
    const exists = get().readingList.find((b) => b.id === book.id);
    if (!exists) {
      set({ readingList: [...get().readingList, { ...book, currentPage: 0 }] });
    }
  },
  removeFromReadingList: (bookId) => {
    set({ readingList: get().readingList.filter((b) => b.id !== bookId) });
  },
  updateProgress: (bookId, page) => {
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
