'use client';

import React from 'react';
import { LayoutDashboard, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'إجمالي المبيعات', value: '١٢,٤٥٠ ج.م', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'عدد الطلبات', value: '٤٨', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'متوسط الطلب', value: '٢٥٩ ج.م', icon: TrendingUp, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
    { name: 'العملاء الجدد', value: '١٢', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
          <LayoutDashboard className="text-black w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-slate-400">نظرة عامة على أداء المطعم اليوم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#1a1d26] border border-white/5 p-6 rounded-3xl hover:border-[#f59e0b]/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">+١٢٪</span>
              </div>
              <h3 className="text-slate-400 text-sm font-bold mb-1">{stat.name}</h3>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1d26] border border-white/5 p-8 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center text-slate-500 gap-4">
          <TrendingUp className="w-12 h-12 opacity-20" />
          <p className="font-bold">رسم بياني للمبيعات (قريباً)</p>
        </div>
        <div className="bg-[#1a1d26] border border-white/5 p-8 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center text-slate-500 gap-4">
          <ShoppingBag className="w-12 h-12 opacity-20" />
          <p className="font-bold">الأصناف الأكثر مبيعاً (قريباً)</p>
        </div>
      </div>
    </div>
  );
}
