import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSocialStore = create(
  persist(
    (set, get) => ({
      following: [],

      follow: (userId) =>
        set((state) => ({ following: [...state.following, userId] })),

      unfollow: (userId) =>
        set((state) => ({ following: state.following.filter((id) => id !== userId) })),

      isFollowing: (userId) => get().following.includes(userId),
    }),
    { name: 'chapters-social' }
  )
);

export default useSocialStore;
