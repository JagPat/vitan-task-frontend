const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';

export function getAuthToken() {
  try {
    return localStorage.getItem('adminToken') || localStorage.getItem('userToken') || null;
  } catch (_) {
    return null;
  }
}

export async function apiGet(path, opts = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error((await safeJson(res))?.error || `GET ${path} failed (${res.status})`);
  return res.json();
}

export async function apiPost(path, body, opts = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: JSON.stringify(body), ...opts, headers });
  if (!res.ok) throw new Error((await safeJson(res))?.error || `POST ${path} failed (${res.status})`);
  return res.json();
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

export { API_BASE };

