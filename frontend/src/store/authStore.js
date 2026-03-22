import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import useBookStore from './bookStore';

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
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user || null,
        loading: false,
      });
      if (session?.user) {
        useBookStore.getState().loadUserBooks(session.user.id);
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
      },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null });
  },
}));

export default useAuthStore;
