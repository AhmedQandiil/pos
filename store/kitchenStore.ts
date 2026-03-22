import { create } from 'zustand';
import { Order } from '../types';

interface KitchenState {
  activeOrders: Order[];
  setOrders: (orders: Order[]) => void;
}

export const useKitchenStore = create<KitchenState>((set) => ({
  activeOrders: [],
  setOrders: (orders) => set({ activeOrders: orders }),
}));
