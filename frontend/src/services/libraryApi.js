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
