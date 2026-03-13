// =============================================================================
// Conerpulse  Admin — Utility Helpers
// =============================================================================

import type { User } from '@/types';

/** Get full name from user with firstname/lastname fields */
export function getUserFullName(user?: Partial<User> | null): string {
  if (!user) return 'Unknown User';
  const first = user.firstname || '';
  const last = user.lastname || '';
  const full = `${first} ${last}`.trim();
  return full || 'Unknown User';
}

/** Get user initials from firstname/lastname */
export function getUserInitials(user?: Partial<User> | null): string {
  if (!user) return 'U';
  const f = user.firstname?.[0] || '';
  const l = user.lastname?.[0] || '';
  return (f + l).toUpperCase() || 'U';
}

/** Format currency amount */
export function formatCurrency(amount: string | number, currency: string = 'NGN'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency} 0.00`;

  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GHS: 'GH₵',
    ZAR: 'R',
  };

  const symbol = symbols[currency] || currency + ' ';
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format date string */
export function formatDate(dateStr: string | null | undefined, includeTime = false): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-US', options);
}

/** Relative time (e.g., "2 hours ago") */
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
}

/** Status color helpers */
export function getStatusStyle(status: string): string {
  const s = status?.toLowerCase();
  switch (s) {
    case 'active':
    case 'completed':
    case 'success':
      return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
    case 'pending':
    case 'processing':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
    case 'blocked':
    case 'failed':
    case 'cancelled':
    case 'rejected':
    case 'expired':
      return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
    case 'inactive':
    case 'frozen':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
    default:
      return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
  }
}

/** Truncate text */
export function truncate(str: string, length: number = 20): string {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

/** Mask card number */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return '****';
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** cn - simple class merge */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}