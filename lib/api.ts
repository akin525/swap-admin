// =============================================================================
// Conerpulse  Admin — Centralized API Service
// =============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/admin';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  body?: Record<string, any>;
  params?: Record<string, string | number | undefined>;
  token?: string | null;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, token } = options;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = buildUrl(endpoint, params);
  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request('/login', { method: 'POST', body: { email, password, device_name: 'web_dashboard' } }),

  logout: (token: string) =>
    request('/logout', { method: 'POST', token }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: (token: string) =>
    request('/dashboard', { token }),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/users', { token, params }),

  getById: (token: string, id: number) =>
    request(`/users/${id}`, { token }),

  update: (token: string, id: number, body: Record<string, any>) =>
    request(`/users/${id}`, { method: 'PUT', token, body }),

  updateStatus: (token: string, id: number, status: string) =>
    request(`/users/${id}/status`, { method: 'PATCH', token, body: { status } }),

  resetPin: (token: string, id: number) =>
    request(`/users/${id}/reset-pin`, { method: 'POST', token }),

  sendMessage: (token: string, id: number, message: string) =>
    request(`/users/${id}/message`, { method: 'POST', token, body: { message } }),

  getWallets: (token: string, id: number) =>
    request(`/users/${id}/wallets`, { token }),

  getTransactions: (token: string, id: number, params?: Record<string, string | number | undefined>) =>
    request(`/users/${id}/transactions`, { token, params }),

  getTransfers: (token: string, id: number, params?: Record<string, string | number | undefined>) =>
    request(`/users/${id}/transfers`, { token, params }),

  getCards: (token: string, id: number) =>
    request(`/users/${id}/cards`, { token }),

  getVirtualAccounts: (token: string, id: number) =>
    request(`/users/${id}/virtual-accounts`, { token }),

  getLogins: (token: string, id: number, params?: Record<string, string | number | undefined>) =>
    request(`/users/${id}/logins`, { token, params }),
};

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactionsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/transactions', { token, params }),

  getById: (token: string, id: number) =>
    request(`/transactions/${id}`, { token }),

  reverse: (token: string, id: number) =>
    request(`/transactions/${id}/reverse`, { method: 'POST', token }),
};

// ─── Wallet Transactions ─────────────────────────────────────────────────────
export const walletTransactionsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/wallet-transactions', { token, params }),

  getById: (token: string, id: number) =>
    request(`/wallet-transactions/${id}`, { token }),
};

// ─── Transfers ───────────────────────────────────────────────────────────────
export const transfersApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/transfers', { token, params }),

  getById: (token: string, id: number) =>
    request(`/transfers/${id}`, { token }),

  updateStatus: (token: string, id: number, status: string, reason?: string) =>
    request(`/transfers/${id}/status`, { method: 'PATCH', token, body: { status, failure_reason: reason } }),
};

// ─── Wallets ─────────────────────────────────────────────────────────────────
export const walletsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/wallets', { token, params }),

  getById: (token: string, id: number) =>
    request(`/wallets/${id}`, { token }),

  updateLimits: (token: string, id: number, body: Record<string, any>) =>
    request(`/wallets/${id}/limits`, { method: 'PATCH', token, body }),

  getAvailable: (token: string) =>
    request('/available-wallets', { token }),

  updateAvailable: (token: string, id: number, body: Record<string, any>) =>
    request(`/available-wallets/${id}`, { method: 'PUT', token, body }),
};

// ─── Cards ───────────────────────────────────────────────────────────────────
export const cardsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/cards', { token, params }),

  getById: (token: string, id: number) =>
    request(`/cards/${id}`, { token }),

  updateStatus: (token: string, id: number, status: string) =>
    request(`/cards/${id}/status`, { method: 'PATCH', token, body: { status } }),

  updateSettings: (token: string, id: number, body: Record<string, any>) =>
    request(`/cards/${id}/settings`, { method: 'PATCH', token, body }),

  getTransactions: (token: string, cardId: number, params?: Record<string, string | number | undefined>) =>
    request(`/cards/${cardId}/transactions`, { token, params }),

  delete: (token: string, id: number) =>
    request(`/cards/${id}`, { method: 'DELETE', token }),
};

// ─── Gift Cards ──────────────────────────────────────────────────────────────
export const giftCardsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/gift-card-transactions', { token, params }),

  getById: (token: string, id: number) =>
    request(`/gift-card-transactions/${id}`, { token }),

  updateStatus: (token: string, id: number, status: string) =>
    request(`/gift-card-transactions/${id}/status`, { method: 'PATCH', token, body: { status } }),
};

// ─── Virtual Accounts ────────────────────────────────────────────────────────
export const virtualAccountsApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/virtual-accounts', { token, params }),

  getById: (token: string, id: number) =>
    request(`/virtual-accounts/${id}`, { token }),

  updateStatus: (token: string, id: number, status: number) =>
    request(`/virtual-accounts/${id}/status`, { method: 'PATCH', token, body: { status } }),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  getBasic: (token: string) =>
    request('/settings', { token }),

  updateBasic: (token: string, body: Record<string, any>) =>
    request('/settings', { method: 'PUT', token, body }),

  getFees: (token: string) =>
    request('/system-fees', { token }),

  updateFee: (token: string, id: number, body: Record<string, any>) =>
    request(`/system-fees/${id}`, { method: 'PUT', token, body }),

  createFee: (token: string, body: Record<string, any>) =>
    request('/system-fees', { method: 'POST', token, body }),

  deleteFee: (token: string, id: number) =>
    request(`/system-fees/${id}`, { method: 'DELETE', token }),

  getCurrencyPairs: (token: string) =>
    request('/currency-pairs', { token }),

  updateCurrencyPair: (token: string, id: number, body: Record<string, any>) =>
    request(`/currency-pairs/${id}`, { method: 'PUT', token, body }),

  createCurrencyPair: (token: string, body: Record<string, any>) =>
    request('/currency-pairs', { method: 'POST', token, body }),

  getExchangeRates: (token: string) =>
    request('/exchange-rates', { token }),

  updateExchangeRate: (token: string, id: number, body: Record<string, any>) =>
    request(`/exchange-rates/${id}`, { method: 'PUT', token, body }),

  getBanks: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/banks', { token, params }),
};

// ─── Admin Management ────────────────────────────────────────────────────────
export const adminApi = {
  getProfile: (token: string) =>
    request('/profile', { token }),

  updateProfile: (token: string, body: Record<string, any>) =>
    request('/profile', { method: 'PUT', token, body }),

  changePassword: (token: string, body: { current_password: string; password: string; password_confirmation: string }) =>
    request('/change-password', { method: 'POST', token, body }),

  getTeam: (token: string) =>
    request('/admins', { token }),

  createAdmin: (token: string, body: Record<string, any>) =>
    request('/admins', { method: 'POST', token, body }),

  updateAdmin: (token: string, id: number, body: Record<string, any>) =>
    request(`/admins/${id}`, { method: 'PUT', token, body }),

  deleteAdmin: (token: string, id: number) =>
    request(`/admins/${id}`, { method: 'DELETE', token }),
};

// ─── KYC ─────────────────────────────────────────────────────────────────────
export const kycApi = {
  getAll: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/kyc', { token, params }),

  getById: (token: string, id: number) =>
    request(`/kyc/${id}`, { token }),

  approve: (token: string, id: number) =>
    request(`/kyc/${id}/approve`, { method: 'POST', token }),

  reject: (token: string, id: number, reason: string) =>
    request(`/kyc/${id}/reject`, { method: 'POST', token, body: { reason } }),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportsApi = {
  getOverview: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/reports/overview', { token, params }),

  getTransactionReport: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/reports/transactions', { token, params }),

  getUserReport: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/reports/users', { token, params }),

  getRevenueReport: (token: string, params?: Record<string, string | number | undefined>) =>
    request('/reports/revenue', { token, params }),

  exportReport: (token: string, type: string, params?: Record<string, string | number | undefined>) =>
    request(`/reports/export/${type}`, { token, params }),
};

// ─── Countries ───────────────────────────────────────────────────────────────
export const countriesApi = {
  getAll: (token: string) =>
    request('/countries', { token }),

  getStates: (token: string, countryId: number) =>
    request(`/countries/${countryId}/states`, { token }),
};