import { create } from 'zustand'; // ✅ NEW
import { persist } from 'zustand/middleware'; // ✅ NEW

export type KitchenStatus = 'preparing' | 'ready' | 'delivered'; // ✅ NEW

export interface KitchenItem { // ✅ NEW
  name: string;
  quantity: number;
  notes?: string;
}

export interface KitchenTicket { // ✅ NEW
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  items: KitchenItem[];
  notes?: string;
  status: KitchenStatus;
  createdAt: Date;
  readyAt: Date | null;
}

interface KitchenState { // ✅ NEW
  tickets: KitchenTicket[];
  addTicket: (ticket: KitchenTicket) => void;
  updateStatus: (ticketId: string, status: KitchenStatus) => void;
  clearTickets: () => void;
}

export const useKitchenStore = create<KitchenState>()( // ✅ NEW
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticket) => set((state) => ({ 
        tickets: [ticket, ...state.tickets] 
      })),
      updateStatus: (ticketId, status) => set((state) => ({
        tickets: state.tickets.map((t) => 
          t.id === ticketId 
            ? { ...t, status, readyAt: status === 'ready' ? new Date() : t.readyAt } 
            : t
        )
      })),
      clearTickets: () => set({ tickets: [] }),
    }),
    {
      name: 'kitchen-storage',
    }
  )
);
