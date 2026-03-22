import { create } from 'zustand';
import { CartItem, Product, DiscountType, OrderType } from '../types';
import { toast } from 'react-hot-toast';
import { useSettingsStore } from './settingsStore';

interface CartState {
  items: CartItem[];
  tableNumber: number | null;
  orderType: OrderType;
  deliveryFees: number;
  discount: number;
  discountType: DiscountType;
  notes: string;
  
  // Derived values (mimicking useMemo pattern)
  subtotal: number;
  discountAmount: number;
  total: number;
  
  /**
   * Adds a product to the cart or increments its quantity if it already exists
   * @param product Product to add
   */
  addItem: (product: Product) => void;
  
  /**
   * Removes a product completely from the cart
   * @param productId ID of the product to remove
   */
  removeItem: (productId: string) => void;
  
  /**
   * Updates the quantity of a product in the cart
   * @param productId ID of the product to update
   * @param quantity New quantity (min 1, 0 removes item)
   */
  updateQuantity: (productId: string, quantity: number) => void;
  
  /**
   * Sets the table number for the order
   * @param num Table number or null
   */
  setTableNumber: (num: number | null) => void;
  
  /**
   * Sets the order type (dine-in, takeaway, delivery)
   * @param type Order type
   */
  setOrderType: (type: OrderType) => void;
  
  /**
   * Sets the delivery fees for delivery orders
   * @param fees Delivery fees amount
   */
  setDeliveryFees: (fees: number) => void;
  
  /**
   * Sets the discount for the order
   * @param amount Discount amount or percentage
   * @param type Discount type (fixed or percentage)
   */
  setDiscount: (amount: number, type: DiscountType) => void;
  
  /**
   * Sets the notes for the order
   * @param notes Order notes
   */
  setNotes: (notes: string) => void;
  
  /**
   * Resets the cart to its initial state
   */
  clearCart: () => void;
}

/**
 * Helper to calculate derived values for the cart
 */
const calculateTotals = (state: Pick<CartState, 'items' | 'discount' | 'discountType' | 'deliveryFees'>) => {
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (state.discountType === 'percentage') {
    discountAmount = (subtotal * state.discount) / 100;
  } else {
    discountAmount = Math.min(state.discount, subtotal); // ✅ BUG FIX: Fixed discount cannot exceed subtotal
  }
  
  // ✅ BUG FIX: Total never negative
  const total = Math.max(0, subtotal - discountAmount + state.deliveryFees);
  
  return { subtotal, discountAmount, total };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableNumber: null,
  orderType: 'takeaway',
  deliveryFees: 0,
  discount: 0,
  discountType: 'fixed',
  notes: '',
  subtotal: 0,
  discountAmount: 0,
  total: 0,

  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);

    let newItems;
    if (existingItem) {
      // ✅ BUG FIX: Increment quantity if product exists
      newItems = items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { product, quantity: 1 }];
    }
    
    const totals = calculateTotals({ ...get(), items: newItems });
    set({ items: newItems, ...totals });
    toast.success(`تم إضافة ${product.name}`);
  },

  removeItem: (productId) => {
    // ✅ BUG FIX: Remove completely from array
    const newItems = get().items.filter((item) => item.product.id !== productId);
    const totals = calculateTotals({ ...get(), items: newItems });
    set({ items: newItems, ...totals });
  },

  updateQuantity: (productId, quantity) => {
    // ✅ BUG FIX: Min 1, if set to 0 remove item
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    const newItems = get().items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    
    const totals = calculateTotals({ ...get(), items: newItems });
    set({ items: newItems, ...totals });
  },

  setTableNumber: (tableNumber) => set({ tableNumber }),
  
  setOrderType: (type) => {
    const settings = useSettingsStore.getState().settings;
    const deliveryFees = type === 'delivery' ? settings.defaultDeliveryFees : 0;
    
    const newState = { 
      ...get(),
      orderType: type, 
      deliveryFees,
      tableNumber: type === 'dine_in' ? get().tableNumber : null 
    };
    
    const totals = calculateTotals(newState);
    set({ ...newState, ...totals });
  },

  setDeliveryFees: (fees) => {
    const totals = calculateTotals({ ...get(), deliveryFees: fees });
    set({ deliveryFees: fees, ...totals });
  },

  setDiscount: (amount, type) => {
    // ✅ BUG FIX: Discount calculation logic
    let finalAmount = Math.max(0, amount);
    if (type === 'percentage') {
      finalAmount = Math.min(finalAmount, 100); // ✅ BUG FIX: Percentage 0-100
    }
    
    const totals = calculateTotals({ ...get(), discount: finalAmount, discountType: type });
    set({ discount: finalAmount, discountType: type, ...totals });
  },

  setNotes: (notes) => set({ notes }),

  clearCart: () => {
    // ✅ BUG FIX: Resets everything including tableNumber and notes
    set({ 
      items: [], 
      tableNumber: null, 
      orderType: 'takeaway', 
      deliveryFees: 0, 
      discount: 0, 
      discountType: 'fixed',
      notes: '',
      subtotal: 0,
      discountAmount: 0,
      total: 0
    });
  },
}));
