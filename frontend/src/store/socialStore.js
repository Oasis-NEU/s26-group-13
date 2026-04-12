import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncFollow, syncUnfollow, getFollowingIds } from '../services/libraryApi';

// Mock profile IDs are not UUIDs — only sync real user IDs to Supabase
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isRealUser = (id) => UUID_RE.test(id);

const useSocialStore = create(
  persist(
    (set, get) => ({
      following: [],

      follow: (targetId, currentUserId = null) => {
        if (get().following.includes(targetId)) return;
        set((state) => ({ following: [...state.following, targetId] }));
        if (currentUserId && isRealUser(targetId)) {
          syncFollow(currentUserId, targetId).catch(console.warn);
        }
      },

      unfollow: (targetId, currentUserId = null) => {
        set((state) => ({ following: state.following.filter((id) => id !== targetId) }));
        if (currentUserId && isRealUser(targetId)) {
          syncUnfollow(currentUserId, targetId).catch(console.warn);
        }
      },

      // Load real follows from Supabase on login, merged with any local mock follows
      loadFollowing: async (userId) => {
        const realFollowing = await getFollowingIds(userId).catch(() => []);
        const { following } = get();
        const mockFollows = following.filter((id) => !isRealUser(id));
        set({ following: [...new Set([...mockFollows, ...realFollowing])] });
      },

      isFollowing: (userId) => get().following.includes(userId),
    }),
    { name: 'chapters-social' }
  )
);

export default useSocialStore;
