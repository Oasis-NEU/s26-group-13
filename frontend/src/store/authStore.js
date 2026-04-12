import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import useBookStore from './bookStore';
import useActivityStore from './activityStore';
import { upsertProfile } from '../services/libraryApi';
import useSocialStore from './socialStore';

const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user || null,
      loading: false,
    });
    if (session?.user) {
      useBookStore.getState().loadUserBooks(session.user.id);
      useSocialStore.getState().loadFollowing(session.user.id);
      useActivityStore.getState().loadUserActivity(session.user.id);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user || null,
        loading: false,
      });
      if (session?.user) {
        useBookStore.getState().loadUserBooks(session.user.id);
        useSocialStore.getState().loadFollowing(session.user.id);
        useActivityStore.getState().loadUserActivity(session.user.id);
      } else {
        useBookStore.getState().clearReadingList();
      }
    });
  },

  signUp: async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin + '/login',
      },
    });
    if (error) throw error;
    // Save profile so other users can find this account
    if (data.user) {
      await upsertProfile(data.user.id, displayName, email);
    }
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Ensure profile exists with latest display_name (backfills existing accounts)
    if (data.user) {
      const displayName = data.user.user_metadata?.display_name || null;
      await upsertProfile(data.user.id, displayName, email);
    }
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null });
  },
}));

export default useAuthStore;
