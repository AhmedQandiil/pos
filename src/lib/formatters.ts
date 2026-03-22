/**
 * Formats a number as Egyptian currency with Arabic numerals
 * @param amount Amount to format
 * @returns Formatted currency string (e.g., "١٢٥.٠٠ جنيه")
 */
export const formatCurrency = (amount: number): string => {
  // ✅ BUG FIX: Format with Arabic numerals and "جنيه" suffix
  const formatted = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} جنيه`;
};

/**
 * Formats a number with Arabic numerals
 * @param num Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-EG').format(num);
};

/**
 * Formats a date in Arabic (e.g., "الخميس، ٢٠ مارس ٢٠٢٥")
 * @param date Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

/**
 * Formats time in Arabic (e.g., "٢:٣٠ م")
 * @param date Date object or ISO string
 * @returns Formatted time string
 */
export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
};

/**
 * Formats date and time in Arabic
 * @param date Date object or ISO string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} - ${formatTime(d)}`;
};

/**
 * Formats an order number (e.g., "#٠٠٠١")
 * @param num Order number
 * @returns Formatted order number string
 */
export const formatOrderNumber = (num: number | string): string => {
  // ✅ BUG FIX: Format order number with leading zeros and Arabic numerals
  const n = typeof num === 'string' ? parseInt(num.replace(/\D/g, ''), 10) : num;
  const formatted = new Intl.NumberFormat('ar-EG', {
    minimumIntegerDigits: 4,
    useGrouping: false,
  }).format(n);
  return `#${formatted}`;
};
