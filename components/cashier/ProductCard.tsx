'use client';

import React from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const colors = [
    'bg-blue-500/20 text-blue-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-purple-500/20 text-purple-400',
    'bg-rose-500/20 text-rose-400',
    'bg-amber-500/20 text-amber-400',
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => product.isAvailable && addItem(product)}
      className={`relative group bg-[#1a1d26] border border-white/5 rounded-2xl p-4 text-right transition-all hover:border-[#f59e0b]/30 flex flex-col h-full ${
        !product.isAvailable ? 'opacity-50 grayscale cursor-not-allowed' : ''
      }`}
    >
      <div className={`w-full aspect-video rounded-xl mb-4 flex items-center justify-center font-bold text-2xl ${randomColor}`}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
        ) : (
          product.name.charAt(0)
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1 leading-tight">{product.name}</h3>
        {product.nameEn && <p className="text-xs text-slate-500 font-mono mb-2">{product.nameEn}</p>}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-[#f59e0b] font-bold font-space-mono text-xl">
          {formatCurrency(product.price)}
        </span>
        <div className="w-10 h-10 bg-[#f59e0b] text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
      </div>

      {!product.isAvailable && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
          <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">غير متاح</span>
        </div>
      )}
    </motion.button>
  );
}
