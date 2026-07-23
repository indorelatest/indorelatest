const API_BASE = '/api';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

// ─── News ─────────────────────────────────────────────────────────────────────
export const fetchAllNews = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/news${query ? `?${query}` : ''}`);
};

export const fetchFeaturedNews = () => apiFetch('/news/featured');
export const fetchTrendingNews = (limit = 5) => apiFetch(`/news/trending?limit=${limit}`);
export const fetchMostReadNews = (limit = 5) => apiFetch(`/news/mostread?limit=${limit}`);
export const fetchLatestNews = (limit = 6) => apiFetch(`/news/latest?limit=${limit}`);
export const fetchBreakingNews = () => apiFetch('/news/breaking');
export const fetchNewsByCategory = (name, sort) =>
  apiFetch(`/news/category/${encodeURIComponent(name)}${sort ? `?sort=${sort}` : ''}`);
export const fetchNewsById = (id) => apiFetch(`/news/${id}`);
export const fetchSearchNews = (q, lang = 'hi') =>
  apiFetch(`/news/search?q=${encodeURIComponent(q)}&lang=${lang}`);
export const postIncrementView = (id) =>
  apiFetch(`/news/${id}/view`, { method: 'POST' });
export const fetchStats = () => apiFetch('/news/stats');
export const verifyAdminPasscode = (passcode) =>
  apiFetch('/news/verify-passcode', { method: 'POST', body: JSON.stringify({ passcode }) });

// Admin News CRUD
export const createNews = (data) =>
  apiFetch('/news', { method: 'POST', body: JSON.stringify(data) });
export const updateNews = (id, data) =>
  apiFetch(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNews = (id) =>
  apiFetch(`/news/${id}`, { method: 'DELETE' });

// ─── Contact ──────────────────────────────────────────────────────────────────
export const submitContact = (data) =>
  apiFetch('/contact', { method: 'POST', body: JSON.stringify(data) });
export const fetchAllContacts = () => apiFetch('/contact');
export const markContactRead = (id) =>
  apiFetch(`/contact/${id}/read`, { method: 'PATCH' });
export const deleteContact = (id) =>
  apiFetch(`/contact/${id}`, { method: 'DELETE' });

// ─── Subscribers ──────────────────────────────────────────────────────────────
export const subscribe = (email) =>
  apiFetch('/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
export const fetchSubscribers = () => apiFetch('/subscribe');
export const unsubscribe = (email) =>
  apiFetch(`/subscribe/${encodeURIComponent(email)}`, { method: 'DELETE' });
