'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProductsStore } from '../../store/productsStore';
import ProductCard from './ProductCard';
import { cn } from '../../lib/utils';

export default function ProductGrid() {
  const { products, categories } = useProductsStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.nameEn?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all text-lg"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-6 py-3 rounded-xl whitespace-nowrap transition-all font-bold border",
              !selectedCategory 
                ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
                : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/20"
            )}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-xl whitespace-nowrap transition-all font-bold border",
                selectedCategory === cat.id 
                  ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
                  : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/20"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">لا توجد منتجات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
}
