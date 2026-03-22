'use client';

import React from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/formatters';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettingsStore } from '../../store/settingsStore';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

// ✅ PERFORMANCE: Wrapped in React.memo
const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const colors = [
    'bg-blue-500/20 text-blue-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-purple-500/20 text-purple-400',
    'bg-rose-500/20 text-rose-400',
    'bg-amber-500/20 text-amber-400',
  ];
  
  const randomColor = colors[product.id.length % colors.length]; // Stable color based on ID

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => product.isAvailable && addItem(product)}
      className={cn(
        "relative group bg-[#1a1d26] border border-white/5 rounded-2xl p-3 md:p-4 text-right transition-all hover:border-[#f59e0b]/30 flex flex-col h-full touch-feedback", // ✅ RESPONSIVE FIX: touch feedback
        !product.isAvailable && "opacity-50 grayscale pointer-events-none" // ✅ RESPONSIVE FIX: pointer-events-none
      )}
    >
      <div className={cn("w-full aspect-square md:aspect-video rounded-xl mb-3 md:mb-4 flex items-center justify-center font-bold text-2xl overflow-hidden", randomColor)}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-xl" 
            referrerPolicy="no-referrer"
            loading="lazy" // ✅ PERFORMANCE: Lazy loading
          />
        ) : (
          product.name.charAt(0)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-lg mb-1 leading-tight line-clamp-2">{product.name}</h3> {/* ✅ RESPONSIVE FIX: line-clamp-2 */}
        {product.nameEn && <p className="text-[10px] md:text-xs text-slate-500 font-mono mb-2 truncate">{product.nameEn}</p>}
      </div>

      <div className="flex items-center justify-between mt-2 md:mt-4">
        <span className="text-[#f59e0b] font-bold font-space-mono text-base md:text-xl">
          {formatCurrency(product.price)}
        </span>
        <div className="w-10 h-10 md:w-11 md:h-11 bg-[#f59e0b] text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"> {/* ✅ RESPONSIVE FIX: min 44px on md+ */}
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>

      {!product.isAvailable && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs md:text-sm font-bold">غير متاح</span>
        </div>
      )}
    </motion.button>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
