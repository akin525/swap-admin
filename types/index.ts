// =============================================================================
// Conerpulse  Admin — TypeScript Interfaces (aligned with SQL schema)
// =============================================================================

// ─── Admin ───────────────────────────────────────────────────────────────────
export interface Admin {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  image: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  role: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  country_code: string | null;
  phone: string | null;
  telegram_id: string | null;
  profile_photo_path: string | null;
  email_verified: number;
  status: 'active' | 'blocked';
  pin: string | null;
  online: number;
  ref_code: string | null;
  referral: string | null;
  notification_settings: string | null;
  biometric_enabled: number;
  two_factor_enabled: number;
  language: string | null;
  currency_preference: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserLogin {
  id: number;
  user_id: number;
  ip_address: string | null;
  device: string | null;
  location: string | null;
  created_at: string;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────
export interface Wallet {
  id: number;
  user_id: number;
  currency: string;
  balance: string;
  cashback: string;
  transfer_single_limit: string;
  transfer_cumulative_limit: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface AvailableWallet {
  id: number;
  currency: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  user_id: number;
  wallet_id: number;
  source: string | null;
  currency: string;
  amount: string;
  fee: string;
  bal_before: string;
  bal_after: string;
  type: string;
  note: string | null;
  status: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

// ─── Transaction ─────────────────────────────────────────────────────────────
export interface Transaction {
  id: number;
  user_id: number;
  wallet: string | null;
  trx_type: string;
  amount: string;
  bal_before: string;
  bal_after: string;
  trx: string;
  type: string;
  reversed: number;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: User;
}

// ─── Transfer ────────────────────────────────────────────────────────────────
export interface Transfer {
  id: number;
  user_id: number;
  wallet_id: number;
  reference: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
  amount: string;
  fee: string;
  total_amount: string;
  currency: string;
  country_code: string | null;
  remarks: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  provider_reference: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  user?: User;
}

// ─── Card ────────────────────────────────────────────────────────────────────
export interface Card {
  id: number;
  user_id: number;
  card_number: string;
  card_holder_name: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  card_type: 'virtual' | 'physical';
  currency: string;
  balance: string;
  status: 'active' | 'inactive' | 'blocked' | 'expired';
  provider_card_id: string | null;
  freeze_physical_card: number;
  disable_web_purchase: number;
  disable_contactless: number;
  is_disabled: number;
  created_at: string;
  updated_at: string;
  // Joined
  user?: User;
}

export interface CardTransaction {
  id: number;
  user_id: number;
  card_id: number;
  reference: string;
  type: 'purchase' | 'refund' | 'withdrawal' | 'deposit';
  amount: string;
  fee: string;
  currency: string;
  status: string;
  description: string | null;
  merchant_name: string | null;
  merchant_category: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Gift Card ───────────────────────────────────────────────────────────────
export interface GiftCardTransaction {
  id: number;
  user_id: number;
  reference: string;
  gift_card_type: string;
  type: 'purchase' | 'redemption';
  amount: string;
  fee: string;
  total_amount: string;
  currency: string;
  recipient_email: string | null;
  message: string | null;
  gift_card_code: string | null;
  gift_card_pin: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined
  user?: User;
}

// ─── Virtual Account ─────────────────────────────────────────────────────────
export interface VirtualAccount {
  id: number;
  user_id: number;
  wallet_id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  status: number;
  metadata: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  user?: User;
}

// ─── Exchange Rate & Currency Pair ───────────────────────────────────────────
export interface ExchangeRate {
  id: number;
  from_currency: string;
  to_currency: string;
  rate: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyPair {
  id: number;
  from: string;
  to: string;
  rate: string;
  fee: string;
  fee_type: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// ─── System ──────────────────────────────────────────────────────────────────
export interface BasicSettings {
  id: number;
  sitename: string;
  description: string | null;
  keywords: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  registration: number;
  login: number;
  maintain: number;
  email_verification: number;
  email_notification: number;
  telegram_notification: number;
  created_at: string;
  updated_at: string;
}

export interface SystemFee {
  id: number;
  currency: string;
  fee: string;
  fee_type: string;
  fee_cap: string;
  created_at: string;
  updated_at: string;
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  country: string;
  currency: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  currency: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  country_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  title: string;
  value: string;
  trend: string;
  color: string;
  icon: string;
}

export interface DashboardData {
  stats: DashboardStats[];
  charts: {
    line: Array<Record<string, any>>;
    pie: Array<{ name: string; value: number; color: string }>;
  };
  transactions: Array<{
    id: string;
    user: string;
    desc: string;
    action: string;
    amount: string;
    date: string;
    status: string;
  }>;
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}