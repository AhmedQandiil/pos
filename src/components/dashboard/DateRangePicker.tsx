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
    <div className="flex flex-col md:flex-row items-center gap-2 bg-[#1a1d26] border border-white/5 p-1.5 rounded-xl w-full md:w-auto overflow-hidden">
      <div className="flex items-center gap-2 px-2 text-slate-400 border-l border-white/5 ml-1 shrink-0">
        <Calendar className="w-4 h-4" />
        <span className="text-xs font-bold whitespace-nowrap hidden lg:inline">الفترة:</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-1 shrink-0">
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

      <div className="h-4 w-px bg-white/5 hidden md:block mx-1 shrink-0" />

      <div className="flex flex-wrap justify-center items-center gap-1 shrink-0">
        <div className="flex items-center gap-1.5 bg-[#0f1117] border border-white/10 rounded-lg px-2 py-1">
          <span className="text-[9px] text-slate-500 font-bold">من:</span>
          <DatePicker
            selected={value.start}
            onChange={(date) => date && onChange({ ...value, start: startOfDay(date) })}
            dateFormat="yyyy-MM-dd"
            locale="ar"
            className="bg-transparent border-none focus:ring-0 text-[11px] font-bold text-white p-0 w-20 cursor-pointer"
            popperPlacement="bottom-end"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-[#0f1117] border border-white/10 rounded-lg px-2 py-1">
          <span className="text-[9px] text-slate-500 font-bold">إلى:</span>
          <DatePicker
            selected={value.end}
            onChange={(date) => date && onChange({ ...value, end: endOfDay(date) })}
            dateFormat="yyyy-MM-dd"
            locale="ar"
            className="bg-transparent border-none focus:ring-0 text-[11px] font-bold text-white p-0 w-20 cursor-pointer"
            popperPlacement="bottom-end"
          />
        </div>
      </div>
    </div>
  );
}
