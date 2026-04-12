import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'nature', // 'default' | 'dark' | 'nature'
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'chapters-theme' }
  )
);

export default useThemeStore;
