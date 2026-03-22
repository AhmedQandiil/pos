'use client';

import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ChevronDown } from 'lucide-react';

export default function TableSelector() {
  const { tableNumber, setTableNumber, orderType, setOrderType } = useCartStore();

  return (
    <div className="flex items-center gap-2">
      {/* Order Type Selector */}
      <div className="relative">
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as any)}
          className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pr-10 text-sm font-black text-white focus:outline-none focus:border-[#f59e0b] transition-all cursor-pointer min-w-[120px] touch-feedback"
        >
          <option value="dine_in">طاولة</option>
          <option value="takeaway">تيك أواي</option>
          <option value="delivery">دليفري</option>
        </select>
        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {/* Table Number Selector (Only for dine_in) */}
      {orderType === 'dine_in' && (
        <div className="relative animate-in fade-in slide-in-from-right-2">
          <select
            value={tableNumber || ''}
            onChange={(e) => setTableNumber(e.target.value ? Number(e.target.value) : null)}
            className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pr-10 text-sm font-black text-white focus:outline-none focus:border-[#f59e0b] transition-all cursor-pointer min-w-[100px] touch-feedback"
          >
            <option value="">طاولة</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                طاولة {num}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
