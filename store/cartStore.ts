import { create } from 'zustand';
import { CartItem, Product, DiscountType } from '../types';
import { toast } from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  tableNumber: number | null;
  discount: number;
  discountType: DiscountType;
  notes: string;
  
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setTableNumber: (num: number | null) => void;
  setDiscount: (amount: number, type: DiscountType) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableNumber: null,
  discount: 0,
  discountType: 'fixed',
  notes: '',

  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
    toast.success(`تم إضافة ${product.name}`);
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  setTableNumber: (tableNumber) => set({ tableNumber }),
  setDiscount: (discount, discountType) => set({ discount, discountType }),
  setNotes: (notes) => set({ notes }),
  clearCart: () => set({ items: [], tableNumber: null, discount: 0, notes: '' }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const { discount, discountType } = get();
    if (discountType === 'percentage') {
      return (subtotal * discount) / 100;
    }
    return discount;
  },

  getTotal: () => {
    return get().getSubtotal() - get().getDiscountAmount();
  },
}));
