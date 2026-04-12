const BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query, limit = 20) {
  if (!query || query.trim().length < 2) return [];

  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i,first_publish_year,isbn,number_of_pages_median,subject`
  );

  if (!res.ok) throw new Error('Failed to search books');

  const data = await res.json();

  return data.docs.map((book) => ({
    id: book.key?.replace('/works/', ''),
    title: book.title,
    authors: book.author_name || [],
    coverId: book.cover_i,
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : null,
    firstPublishYear: book.first_publish_year,
    isbn: book.isbn?.[0] || null,
    pages: book.number_of_pages_median || null,
    subjects: book.subject?.slice(0, 5) || [],
  }));
}

export async function fetchPageCount(workId) {
  try {
    const res = await fetch(`${BASE_URL}/works/${workId}/editions.json?limit=10`);
    if (!res.ok) return null;
    const data = await res.json();
    const counts = (data.entries || [])
      .map((e) => e.number_of_pages)
      .filter((n) => n > 0);
    if (!counts.length) return null;
    counts.sort((a, b) => a - b);
    return counts[Math.floor(counts.length / 2)];
  } catch {
    return null;
  }
}

export async function getBookDetails(workId) {
  const [workRes, pages] = await Promise.all([
    fetch(`${BASE_URL}/works/${workId}.json`),
    fetchPageCount(workId),
  ]);

  if (!workRes.ok) throw new Error('Failed to fetch book details');

  const data = await workRes.json();

  return {
    id: workId,
    title: data.title,
    description:
      typeof data.description === 'string'
        ? data.description
        : data.description?.value || 'No description available.',
    covers: data.covers?.map(
      (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`
    ) || [],
    subjects: data.subjects?.slice(0, 10) || [],
    firstPublishDate: data.first_publish_date || null,
    pages,
  };
}

export async function getTrendingBooks() {
  const res = await fetch(
    `${BASE_URL}/trending/daily.json?limit=10`
  );

  if (!res.ok) throw new Error('Failed to fetch trending books');

  const data = await res.json();

  return data.works.map((book) => ({
    id: book.key?.replace('/works/', ''),
    title: book.title,
    authors: book.author_name || [],
    coverId: book.cover_i,
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : null,
    firstPublishYear: book.first_publish_year,
    pages: null,
    subjects: [],
  }));
}
