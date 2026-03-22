'use client';

import React, { useState } from 'react';
import ProductGrid from '../../components/cashier/ProductGrid';
import OrderCart from '../../components/cashier/OrderCart';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';

export default function CashierPage() {
  const { items } = useCartStore();
  const { isSidebarCollapsed } = useUIStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden relative">
      {/* ✅ RESPONSIVE FIX: Left Panel (Products) - full width on mobile/tablet, 65% on desktop */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ProductGrid />
      </div>

      {/* ✅ RESPONSIVE FIX: Right Panel (Cart) - fixed on lg+, drawer/overlay on md/base */}
      <div 
        className={cn(
          "fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:w-[400px] lg:flex flex-col transition-all duration-300",
          isCartOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        )}
      >
        {/* Backdrop for mobile/tablet */}
        {isCartOpen && (
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsCartOpen(false)}
          />
        )}
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[90vh] lg:h-full lg:relative bg-[#1a1d26] lg:bg-transparent rounded-t-3xl lg:rounded-none overflow-hidden flex flex-col",
          isCartOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        )}>
          {/* Handle for drawer */}
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-3 lg:hidden" />
          
          <OrderCart onClose={() => setIsCartOpen(false)} />
        </div>
      </div>

      {/* ✅ RESPONSIVE FIX: Floating Cart Button for Mobile/Tablet */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-20 left-6 w-16 h-16 bg-[#f59e0b] text-black rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center lg:hidden z-[60] touch-feedback active:scale-90 transition-transform"
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
