'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/formatters';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  color: string;
  isCurrency?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, color, isCurrency = true }: StatsCardProps) {
  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/5 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm font-bold mb-1">{title}</p>
      <p className={`text-2xl font-bold font-space-mono`}>
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </p>
    </div>
  );
}
