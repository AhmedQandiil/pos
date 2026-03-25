'use client';

import React, { useState } from 'react';
import ProductGrid from '../../components/cashier/ProductGrid';
import OrderCart from '../../components/cashier/OrderCart';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';
import PaymentModal from '../../components/cashier/PaymentModal'; // ✅ NEW

export default function CashierPage() {
  const { items } = useCartStore();
  const { isSidebarCollapsed } = useUIStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 overflow-hidden relative">
      {/* Payment Modal - Global */}
      <PaymentModal /> {/* ✅ NEW */}

      {/* ✅ RESPONSIVE FIX: Left Panel (Products) - full width on mobile, shared on tablet/desktop */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ProductGrid />
      </div>

      {/* ✅ RESPONSIVE FIX: Right Panel (Cart) - fixed on md+, drawer/overlay on sm */}
      <div 
        className={cn(
          "fixed inset-0 z-50 md:relative md:inset-auto md:z-0 md:w-[350px] lg:w-[400px] md:flex flex-col transition-all duration-300",
          isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
        )}
      >
        {/* Backdrop for mobile */}
        {isCartOpen && (
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsCartOpen(false)}
          />
        )}
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[90vh] md:h-full md:relative bg-[#1a1d26] md:bg-transparent rounded-t-3xl md:rounded-none overflow-hidden flex flex-col",
          isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
        )}>
          {/* Handle for drawer */}
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-3 md:hidden" />
          
          <OrderCart onClose={() => setIsCartOpen(false)} />
        </div>
      </div>

      {/* ✅ RESPONSIVE FIX: Floating Cart Button for Mobile Only */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-[#f59e0b] text-black rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center md:hidden z-[60] touch-feedback active:scale-90 transition-transform"
      >
        <div className="relative">
          <ShoppingCart className="w-8 h-8" />
          {items.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#1a1d26] shadow-lg">
              {items.length}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
