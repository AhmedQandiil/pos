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
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border min-h-[48px] flex items-center justify-center",
          selected === null 
            ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
            : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/10"
        )}
      >
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border min-h-[48px] flex items-center justify-center",
            selected === category.id 
              ? "bg-[#f59e0b] text-black border-[#f59e0b]" 
              : "bg-[#1a1d26] text-slate-400 border-white/5 hover:border-white/10"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
