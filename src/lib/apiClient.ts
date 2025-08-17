export const BASE_URL = import.meta.env.VITE_API_BASE_URL!;

export async function api(path: string, init: RequestInit = {}) {
  const r = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers||{}) }, ...init
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

// Backward compatibility helpers
export const apiClient = {
  get: (url: string, config = {}) => 
    api(url, { method: 'GET', ...config }),
  
  post: (url: string, data = {}, config = {}) => 
    api(url, { method: 'POST', body: JSON.stringify(data), ...config }),
  
  put: (url: string, data = {}, config = {}) => 
    api(url, { method: 'PUT', body: JSON.stringify(data), ...config }),
  
  delete: (url: string, config = {}) => 
    api(url, { method: 'DELETE', ...config }),
  
  patch: (url: string, data = {}, config = {}) => 
    api(url, { method: 'PATCH', body: JSON.stringify(data), ...config }),
};

export default apiClient;
