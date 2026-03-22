import { create } from 'zustand';
import { Order } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_ORDERS } from '../lib/mockData';
import { startOfDay, endOfDay, isWithinInterval, format } from 'date-fns';

interface OrdersState {
  orders: Order[];
  lastOrderNumber: number;
  
  /**
   * Adds a new order and generates a unique order number
   * @param order Order data (without orderNumber)
   */
  addOrder: (order: Omit<Order, 'orderNumber'>) => void;
  
  /**
   * Updates the status of an order with transition validation
   * @param orderId ID of the order
   * @param status New status
   */
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  /**
   * Cancels an order
   * @param orderId ID of the order
   */
  cancelOrder: (orderId: string) => void;
  
  /**
   * Returns orders within a specific date range
   * @param start Start date
   * @param end End date
   */
  getOrdersByDateRange: (start: Date, end: Date) => Order[];
  
  /**
   * Returns total sales for a specific day
   * @param date Date to check
   */
  getDailySales: (date: Date) => number;
  
  /**
   * Returns total sales for a specific month
   * @param year Year
   * @param month Month (0-11)
   */
  getMonthlySales: (year: number, month: number) => number;
  
  /**
   * Returns top selling products within a date range
   * @param startDate Start date
   * @param endDate End date
   * @param limit Number of products to return
   */
  getTopProducts: (startDate: Date, endDate: Date, limit?: number) => { productId: string; name: string; quantity: number; total: number }[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: storage.get<Order[]>('pos_orders', MOCK_ORDERS),
  lastOrderNumber: storage.get<number>('pos_last_order_number', MOCK_ORDERS.length),

  addOrder: (orderData) => {
    // ✅ LOGIC FIX: Generates unique orderNumber (format: #0001, #0002...)
    const nextNumber = get().lastOrderNumber + 1;
    const orderNumber = nextNumber.toString(); // Formatter will handle the #0001 display
    
    const newOrder: Order = {
      ...orderData,
      orderNumber,
    };

    set((state) => {
      const newOrders = [newOrder, ...state.orders];
      storage.set('pos_orders', newOrders);
      storage.set('pos_last_order_number', nextNumber); // ✅ LOGIC FIX: Persists and increments
      return { orders: newOrders, lastOrderNumber: nextNumber };
    });
  },

  updateOrderStatus: (orderId, status) => {
    // ✅ LOGIC FIX: Validates status transitions
    const order = get().orders.find(o => o.id === orderId);
    if (!order) return;

    // Basic validation: can't move back from completed/cancelled
    if (order.status === 'completed' || order.status === 'cancelled') {
      console.warn(`Cannot change status of a ${order.status} order`);
      return;
    }

    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { 
          ...o, 
          status, 
          completedAt: status === 'completed' ? new Date() : o.completedAt 
        } : o
      );
      storage.set('pos_orders', newOrders);
      return { orders: newOrders };
    });
  },

  cancelOrder: (orderId) => {
    const order = get().orders.find(o => o.id === orderId);
    if (!order || order.status === 'completed') return;

    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      );
      storage.set('pos_orders', newOrders);
      return { orders: newOrders };
    });
  },

  getOrdersByDateRange: (start, end) => {
    // ✅ LOGIC FIX: Correct date comparison (start of day to end of day)
    const interval = { start: startOfDay(start), end: endOfDay(end) };
    return get().orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return isWithinInterval(orderDate, interval);
    });
  },

  getDailySales: (date) => {
    // ✅ LOGIC FIX: Returns total for specific day
    const dayOrders = get().getOrdersByDateRange(date, date);
    return dayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
  },

  getMonthlySales: (year, month) => {
    // ✅ LOGIC FIX: Returns total for month
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const monthOrders = get().getOrdersByDateRange(start, end);
    return monthOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
  },

  getTopProducts: (startDate, endDate, limit = 5) => {
    // ✅ LOGIC FIX: Returns ranked products
    const rangeOrders = get().getOrdersByDateRange(startDate, endDate)
      .filter(o => o.status === 'completed');
    
    const productStats: Record<string, { productId: string; name: string; quantity: number; total: number }> = {};

    rangeOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            productId: item.productId,
            name: item.productName,
            quantity: 0,
            total: 0
          };
        }
        productStats[item.productId].quantity += item.quantity;
        productStats[item.productId].total += item.total;
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }
}));
