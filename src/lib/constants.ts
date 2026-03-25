export const APP_NAME = 'مطعم الشيف أحمد';
export const TAX_RATE = 0.14; // 14% VAT
export const CURRENCY = 'ج.م';

export const COLORS = {
  bg: '#0f1117',
  card: '#1a1d26',
  accent: '#f59e0b',
  text: '#ffffff',
  muted: '#94a3b8',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  preparing: 'قيد التحضير',
  ready: 'جاهز',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'كاش',
  card: 'فيزا',
  wallet: 'محفظة',
  credit: 'آجل',
};

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  rent: 'إيجار',
  salaries: 'رواتب',
  ingredients: 'خامات',
  maintenance: 'صيانة',
  other: 'أخرى',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'مدير نظام',
  manager: 'مدير فرع',
  cashier: 'كاشير',
};
