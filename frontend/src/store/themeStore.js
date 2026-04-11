import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'default', // 'default' | 'dark' | 'nature'
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'chapters-theme' }
  )
);

export default useThemeStore;
