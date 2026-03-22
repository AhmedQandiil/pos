'use client';

import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2 bg-[#1a1d26] border border-white/5 p-1 rounded-xl">
      <div className="flex items-center gap-2 px-4 text-slate-400">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-bold">الفترة:</span>
      </div>
      
      <div className="flex gap-1">
        {[
          { label: 'اليوم', days: 0 },
          { label: 'أسبوع', days: 7 },
          { label: 'شهر', days: 30 },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - btn.days);
              onChange({ start, end });
            }}
            className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition-all"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
