'use client';

import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Percent, Tag } from 'lucide-react';

export default function OrderSummary() {
  const { getSubtotal, getDiscountAmount, getTotal, discount, setDiscount, discountType } = useCartStore();
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-400">
        <span>الإجمالي الفرعي</span>
        <span className="font-space-mono">{formatCurrency(getSubtotal())}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <button 
          onClick={() => setIsEditingDiscount(!isEditingDiscount)}
          className="flex items-center gap-1 text-slate-400 hover:text-[#f59e0b] transition-colors"
        >
          <Tag className="w-3 h-3" />
          <span>الخصم</span>
        </button>
        <span className="text-red-400 font-space-mono">-{formatCurrency(getDiscountAmount())}</span>
      </div>

      {isEditingDiscount && (
        <div className="flex gap-2 bg-[#0f1117] p-2 rounded-lg border border-white/5">
          <input
            type="number"
            value={discount || ''}
            onChange={(e) => setDiscount(Number(e.target.value), discountType)}
            placeholder="0"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-space-mono"
          />
          <button
            onClick={() => setDiscount(discount, discountType === 'percentage' ? 'fixed' : 'percentage')}
            className="p-1 hover:bg-white/5 rounded transition-colors"
          >
            {discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <span className="text-xs font-bold">ج.م</span>}
          </button>
        </div>
      )}

      <div className="h-px bg-white/5 my-2" />

      <div className="flex justify-between items-center">
        <span className="font-bold">الإجمالي النهائي</span>
        <span className="text-2xl font-bold text-[#f59e0b] font-space-mono">
          {formatCurrency(getTotal())}
        </span>
      </div>
    </div>
  );
}
