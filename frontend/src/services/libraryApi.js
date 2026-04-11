import { supabase } from './supabaseClient';

export async function fetchUserBooks(userId) {
  const { data, error } = await supabase
    .from('user_books')
    .select(`
      id,
      status,
      current_page,
      rating,
      books (
        id,
        open_library_id,
        title,
        author,
        cover_url,
        page_count,
        published_year
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function addBookToLibrary(userId, book) {
  // Ensure a profile row exists for this user (required by user_books FK)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id' });

  if (profileError) throw profileError;

  // Upsert book metadata
  const { data: bookRow, error: bookError } = await supabase
    .from('books')
    .upsert(
      {
        open_library_id: book.id,
        title: book.title,
        author: book.authors?.[0] || null,
        cover_url: book.coverUrl || null,
        page_count: book.pages || null,
        published_year: book.firstPublishYear || null,
      },
      { onConflict: 'open_library_id' }
    )
    .select('id')
    .single();

  if (bookError) throw bookError;

  // Link book to user
  const { data: userBook, error: userBookError } = await supabase
    .from('user_books')
    .insert({ user_id: userId, book_id: bookRow.id, status: 'to_read', current_page: 0 })
    .select('id')
    .single();

  if (userBookError) throw userBookError;

  return { bookRow, userBook };
}

export async function removeBookFromLibrary(userBookId) {
  const { error } = await supabase.from('user_books').delete().eq('id', userBookId);
  if (error) throw error;
}

export async function updateBookProgress(userBookId, currentPage) {
  const { error } = await supabase
    .from('user_books')
    .update({ current_page: currentPage })
    .eq('id', userBookId);
  if (error) throw error;
}

// Save username so other users can discover this account
// profiles table has: id, username, avatar_url, yearly_goal, daily_min_goal, created_at
export async function upsertProfile(userId, displayName, _email) {
  // Derive a username from displayName (lowercase, no spaces)
  const username = displayName
    ? displayName.toLowerCase().replace(/\s+/g, '_')
    : null;
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, username: username || null },
      { onConflict: 'id', ignoreDuplicates: false }
    );
  if (error) console.warn('upsertProfile failed:', error.message);
}

// Fetch all profiles for the Discover tab (excludes the current user)
export async function fetchProfiles(query = '', currentUserId = null) {
  let req = supabase
    .from('profiles')
    .select('id, username')
    .order('id');

  if (currentUserId) {
    req = req.neq('id', currentUserId);
  }

  const { data, error } = await req;
  if (error) throw error;

  // Only show profiles that have a username set
  const withNames = (data || []).filter((p) => p.username);

  if (!query) return withNames;
  const q = query.toLowerCase();
  return withNames.filter((p) => p.username.toLowerCase().includes(q));
}
