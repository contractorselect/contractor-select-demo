/**
 * Brand-mandated formatting per Design System §11.
 *
 * Currency: "AED 24,592.00" — full code, 2 decimals, thousands separators.
 * Dates: human-style for body, ISO for metadata.
 * Pseudonymous handles: always uppercase mono.
 */

const AED_FORMATTER = new Intl.NumberFormat('en-AE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(
  amount: number,
  currency: string = 'AED',
): string {
  return `${currency}\u00A0${AED_FORMATTER.format(amount)}`;
}

/**
 * Compact currency for tables where the full format crowds. Drops decimals
 * if the amount is a whole number; never compresses with K / M.
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'AED',
): string {
  const isWhole = Number.isInteger(amount);
  const formatted = isWhole
    ? amount.toLocaleString('en-AE')
    : AED_FORMATTER.format(amount);
  return `${currency}\u00A0${formatted}`;
}

/**
 * Format human-readable date: "30 April 2026"
 */
export function formatDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format datetime with timezone for metadata: "30 Apr 2026 14:23 UAE"
 */
export function formatDateTime(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} ${timePart} UAE`;
}

/**
 * Relative time for <24h, absolute beyond.
 */
export function formatRelativeOrAbsolute(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const diffMs = Date.now() - date.getTime();
  const diffH = diffMs / 3_600_000;
  if (diffH < 1) {
    const minutes = Math.max(1, Math.floor(diffMs / 60_000));
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffH < 24) {
    const hours = Math.floor(diffH);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  return formatDate(date);
}

/**
 * Countdown — used for award expiry, bid validity.
 * Returns "47h 23m" / "12d 4h" depending on magnitude.
 */
export function formatCountdown(targetDate: Date | string): string {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days >= 1) {
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  const remainingMinutes = Math.floor((diffMs % 3_600_000) / 60_000);
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format pseudonymous handle for consistent display.
 */
export function formatHandle(handle: string): string {
  return handle.toUpperCase();
}
