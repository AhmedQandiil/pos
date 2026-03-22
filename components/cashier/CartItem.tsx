'use client';

import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Plus, Minus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="bg-[#0f1117] rounded-xl p-3 border border-white/5 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-sm leading-tight">{item.product.name}</h4>
          <p className="text-xs text-[#f59e0b] font-space-mono mt-1">
            {formatCurrency(item.product.price)}
          </p>
        </div>
        <button 
          onClick={() => removeItem(item.product.id)}
          className="text-slate-600 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#1a1d26] rounded-lg p-1 border border-white/5">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-md transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold font-space-mono">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <span className="font-bold text-[#f59e0b] font-space-mono">
          {formatCurrency(item.product.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
