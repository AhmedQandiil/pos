export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  createdAt: string; // ISO string for storage
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus = 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'credit';
export type DiscountType = 'percentage' | 'fixed';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: number;
  cashierId: string;
  cashierName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType: DiscountType;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid?: number;
  change?: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export type ExpenseCategory = 'rent' | 'salaries' | 'ingredients' | 'maintenance' | 'other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string
  notes?: string;
  createdBy: string;
}

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  name: string;
  pin: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string; // ISO string
}
