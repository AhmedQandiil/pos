export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  createdAt: Date; // ✅ LOGIC FIX: Proper Date objects
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
export type OrderType = 'takeaway' | 'delivery' | 'dine_in'; // ✅ LOGIC FIX: Added dine_in

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: number;
  orderType: OrderType;
  deliveryFees: number;
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
  createdAt: Date; // ✅ LOGIC FIX: Proper Date objects
  completedAt?: Date; // ✅ LOGIC FIX: Proper Date objects
}

export interface Settings {
  restaurantName: string;
  phoneNumber: string;
  address: string;
  defaultDeliveryFees: number;
  currency: string;
  taxRate: number;
}

export type ExpenseCategory = 'rent' | 'salaries' | 'ingredients' | 'maintenance' | 'other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: Date; // ✅ LOGIC FIX: Proper Date objects
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
  lastLogin?: Date; // ✅ LOGIC FIX: Proper Date objects
}
