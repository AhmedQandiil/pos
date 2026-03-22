'use client';

import React from 'react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ar', ar);

interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#1a1d26] border border-white/5 p-2 rounded-xl">
      <div className="flex items-center gap-2 px-2 text-slate-400 border-l border-white/5 ml-2">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-bold whitespace-nowrap">الفترة:</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {[
          { label: 'اليوم', days: 0 },
          { label: 'أسبوع', days: 7 },
          { label: 'شهر', days: 30 },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              const end = endOfDay(new Date());
              const start = startOfDay(subDays(new Date(), btn.days));
              onChange({ start, end });
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-white/5 hidden sm:block mx-2" />

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-2 py-1">
          <span className="text-[10px] text-slate-500 font-bold">من:</span>
          <DatePicker
            selected={value.start}
            onChange={(date) => date && onChange({ ...value, start: startOfDay(date) })}
            dateFormat="yyyy-MM-dd"
            locale="ar"
            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-white p-0 w-24 cursor-pointer"
            popperPlacement="bottom-end"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-2 py-1">
          <span className="text-[10px] text-slate-500 font-bold">إلى:</span>
          <DatePicker
            selected={value.end}
            onChange={(date) => date && onChange({ ...value, end: endOfDay(date) })}
            dateFormat="yyyy-MM-dd"
            locale="ar"
            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-white p-0 w-24 cursor-pointer"
            popperPlacement="bottom-end"
          />
        </div>
      </div>
    </div>
  );
}
