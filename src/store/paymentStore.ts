import { create } from 'zustand'; // ✅ NEW

export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'credit'; // ✅ NEW

interface PaymentState { // ✅ NEW
  isOpen: boolean;
  currentStep: 1 | 2 | 3;
  selectedMethod: PaymentMethod | null;
  amountPaid: number;
  
  // Actions
  openPayment: () => void;
  closePayment: () => void;
  setStep: (step: 1 | 2 | 3) => void;
  setMethod: (method: PaymentMethod) => void;
  setAmountPaid: (amount: number) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({ // ✅ NEW
  isOpen: false,
  currentStep: 1,
  selectedMethod: null,
  amountPaid: 0,

  openPayment: () => set({ isOpen: true, currentStep: 1, selectedMethod: null, amountPaid: 0 }),
  closePayment: () => set({ isOpen: false }),
  setStep: (step) => set({ currentStep: step }),
  setMethod: (method) => set({ selectedMethod: method, currentStep: 2 }), // Auto-advance to step 2
  setAmountPaid: (amount) => set({ amountPaid: amount }),
  reset: () => set({ currentStep: 1, selectedMethod: null, amountPaid: 0 }),
}));
