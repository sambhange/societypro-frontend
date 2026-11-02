const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://societypro-backend-production-e249.up.railway.app';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
  document.cookie = 'token=; path=/; max-age=0';
  document.cookie = 'userType=; path=/; max-age=0';
  document.cookie = 'residentToken=; path=/; max-age=0';
  window.location.href = '/';
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  login:         (email, password) => apiFetch('/api/auth/login',          { method: 'POST', body: JSON.stringify({ email, password }) }),
  residentLogin: (email, password) => apiFetch('/api/auth/resident-login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register:      (data)            => apiFetch('/api/saas/register',        { method: 'POST', body: JSON.stringify(data) }),
};

export const dashboardAPI = {
  getStats:         () => apiFetch('/api/dashboard/stats'),
  getAnnouncements: () => apiFetch('/api/announcements'),
  getMeetings:      () => apiFetch('/api/meetings'),
};

export const residentsAPI = {
  getAll:  ()        => apiFetch('/api/residents'),
  getOne:  (id)      => apiFetch(`/api/residents/${id}`),
  create:  (data)    => apiFetch('/api/residents',     { method: 'POST',   body: JSON.stringify(data) }),
  update:  (id, d)   => apiFetch(`/api/residents/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete:  (id)      => apiFetch(`/api/residents/${id}`, { method: 'DELETE' }),
};

export const maintenanceAPI = {
  getAll:   ()        => apiFetch('/api/maintenance'),
  markPaid: (id, d)   => apiFetch(`/api/maintenance/${id}/pay`, { method: 'POST', body: JSON.stringify(d) }),
  generate: (month)   => apiFetch('/api/maintenance/generate',  { method: 'POST', body: JSON.stringify({ month }) }),
};

export const paymentsAPI = {
  getHistory:    ()     => apiFetch('/api/payments'),
  createOrder:   (data) => apiFetch('/api/payments/create-order', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data) => apiFetch('/api/payments/verify',       { method: 'POST', body: JSON.stringify(data) }),
};

export const settingsAPI = {
  get:    ()     => apiFetch('/api/settings'),
  update: (data) => apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export default apiFetch;
