const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    // Auto-logout on unauthorized
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
    } catch {}
    if (typeof window !== 'undefined' && !path.includes('/auth/jwt')) {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    let msg = 'Request failed';
    try { const data = await res.json(); msg = data?.detail || JSON.stringify(data); } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  async login(username, password) {
    const data = await request('/auth/jwt/create/', { method: 'POST', body: JSON.stringify({ username, password }) });
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh', data.refresh);
    // Store user info to check if admin
    localStorage.setItem('username', username);
    return data;
  },
  async signup(payload) {
    return request('/auth/register/', { method: 'POST', body: JSON.stringify(payload) });
  },
  me() { return request('/auth/me/'); },
  updateMe(payload) { return request('/auth/me/', { method: 'PATCH', body: JSON.stringify(payload) }); },

  // Products
  listProducts() { return request('/products/'); },
  getProduct(id) { return request(`/products/${id}/`); },
  createProduct(payload) { return request('/products/', { method: 'POST', body: JSON.stringify(payload) }); },
  updateProduct(id, payload) { return request(`/products/${id}/`, { method: 'PUT', body: JSON.stringify(payload) }); },
  deleteProduct(id) { return request(`/products/${id}/`, { method: 'DELETE' }); },

  // Categories
  listCategories() { return request('/categories/'); },

  // Cart
  getCart() { return request('/cart/'); },
  addToCart(product, quantity = 1) { return request('/cart/add/', { method: 'POST', body: JSON.stringify({ product, quantity }) }); },
  updateCart(product, quantity) { return request('/cart/update/', { method: 'PATCH', body: JSON.stringify({ product, quantity }) }); },
  removeFromCart(product) { return request('/cart/remove/', { method: 'DELETE', body: JSON.stringify({ product }) }); },

  // Orders
  listOrders() { return request('/orders/'); },
  getOrder(id) { return request(`/orders/${id}/`); },
  placeOrder(payload) { return request('/orders/', { method: 'POST', body: JSON.stringify(payload) }); },

  // Utils
  isAdmin() {
    return localStorage.getItem('username') === 'admin';
  },
  isLoggedIn() { return !!getToken(); },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
  },
};

