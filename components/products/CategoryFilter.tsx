'use client';

import React from 'react';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-6 py-3 rounded-xl whitespace-nowrap transition-all font-bold border",
          !selected 
            ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
            : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/20"
        )}
      >
        الكل
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "px-6 py-3 rounded-xl whitespace-nowrap transition-all font-bold border",
            selected === cat.id 
              ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
              : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/20"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
