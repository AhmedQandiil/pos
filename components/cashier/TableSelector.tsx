'use client';

import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ChevronDown } from 'lucide-react';

export default function TableSelector() {
  const { tableNumber, setTableNumber } = useCartStore();

  return (
    <div className="relative group">
      <select
        value={tableNumber || ''}
        onChange={(e) => setTableNumber(e.target.value ? Number(e.target.value) : null)}
        className="appearance-none bg-[#0f1117] border border-white/5 rounded-xl px-4 py-2 pr-10 text-sm font-bold focus:outline-none focus:border-[#f59e0b]/50 transition-all cursor-pointer min-w-[120px]"
      >
        <option value="">سفري / تيك أواي</option>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            طاولة {num}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}
