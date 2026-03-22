import { create } from 'zustand';
import { Order } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_ORDERS } from '../lib/mockData';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: storage.get<Order[]>('pos_orders', MOCK_ORDERS),

  addOrder: (order) => {
    set((state) => {
      const newOrders = [order, ...state.orders];
      storage.set('pos_orders', newOrders);
      return { orders: newOrders };
    });
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { ...o, status, completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt } : o
      );
      storage.set('pos_orders', newOrders);
      return { orders: newOrders };
    });
  },

  cancelOrder: (orderId) => {
    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      );
      storage.set('pos_orders', newOrders);
      return { orders: newOrders };
    });
  },
}));
