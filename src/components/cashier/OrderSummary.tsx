'use client';

import React, { useState, useMemo } from 'react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function OrderSummary() {
  const { 
    subtotal, discountAmount, total, 
    discount, setDiscount, discountType, 
    orderType, deliveryFees, setDeliveryFees 
  } = useCartStore();
  
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs md:text-sm text-slate-400">
        <span>الإجمالي الفرعي</span>
        <span className="font-space-mono">{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between items-center text-xs md:text-sm">
        <button 
          onClick={() => setIsEditingDiscount(!isEditingDiscount)}
          className="flex items-center gap-1 text-slate-400 hover:text-[#f59e0b] transition-colors touch-feedback"
        >
          <Tag className="w-3 h-3 md:w-4 md:h-4" />
          <span>الخصم</span>
        </button>
        <span className="text-rose-400 font-space-mono">-{formatCurrency(discountAmount)}</span>
      </div>

      {isEditingDiscount && (
        <div className="flex gap-2 bg-[#0f1117] p-2 rounded-xl border border-white/5">
          <input
            type="number"
            value={discount || ''}
            onChange={(e) => setDiscount(Number(e.target.value), discountType)}
            placeholder="0"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-space-mono min-h-[40px]"
          />
          <div className="flex bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setDiscount(discount, 'percentage')}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all touch-feedback",
                discountType === 'percentage' ? "bg-[#f59e0b] text-black" : "text-slate-400"
              )}
            >
              %
            </button>
            <button
              onClick={() => setDiscount(discount, 'fixed')}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all touch-feedback",
                discountType === 'fixed' ? "bg-[#f59e0b] text-black" : "text-slate-400"
              )}
            >
              ج.م
            </button>
          </div>
        </div>
      )}

      {orderType === 'delivery' && (
        <>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <button 
              onClick={() => setIsEditingDelivery(!isEditingDelivery)}
              className="flex items-center gap-1 text-slate-400 hover:text-[#f59e0b] transition-colors touch-feedback"
            >
              <Tag className="w-3 h-3 md:w-4 md:h-4" />
              <span>رسوم التوصيل</span>
            </button>
            <span className="text-blue-400 font-space-mono">+{formatCurrency(deliveryFees)}</span>
          </div>

          {isEditingDelivery && (
            <div className="flex gap-2 bg-[#0f1117] p-2 rounded-xl border border-white/5">
              <input
                type="number"
                value={deliveryFees || ''}
                onChange={(e) => setDeliveryFees(Number(e.target.value))}
                placeholder="0"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-space-mono min-h-[40px]"
              />
              <span className="text-[10px] font-bold text-slate-500 self-center px-2">ج.م</span>
            </div>
          )}
        </>
      )}

      <div className="h-px bg-white/5 my-2" />

      <div className="flex justify-between items-center">
        <span className="font-bold text-sm md:text-base">الإجمالي النهائي</span>
        <span className="text-xl md:text-2xl font-bold text-[#f59e0b] font-space-mono">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
