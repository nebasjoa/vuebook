const API_BASE = '/api/posts';

async function getJson(url) {
  const response = await fetch(url);
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function fetchPosts(limit = 100) {
  const payload = await getJson(`${API_BASE}?limit=${limit}`);
  return payload.posts || [];
}

export async function fetchPostBySlug(slug) {
  const payload = await getJson(`${API_BASE}/${encodeURIComponent(slug)}`);
  return payload.post || null;
}
