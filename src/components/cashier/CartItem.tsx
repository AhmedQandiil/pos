'use client';

import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Plus, Minus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  key?: any;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="bg-[#0f1117] rounded-2xl p-3 md:p-4 border border-white/5 group hover:border-white/10 transition-all">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm md:text-base leading-tight truncate">{item.product.name}</h4>
          <p className="text-xs md:text-sm text-[#f59e0b] font-space-mono mt-1">
            {formatCurrency(item.product.price)}
          </p>
        </div>
        <button 
          onClick={() => removeItem(item.product.id)}
          className="text-slate-600 hover:text-rose-500 transition-colors p-2 touch-feedback"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#1a1d26] rounded-xl p-1 border border-white/5 shrink-0">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors touch-feedback"
          >
            <Minus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <span className="w-8 md:w-10 text-center font-bold font-space-mono text-sm md:text-base">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors touch-feedback"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        <span className="font-bold text-[#f59e0b] font-space-mono text-sm md:text-lg">
          {formatCurrency(item.product.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
