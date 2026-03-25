'use client';

import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Users, ShoppingBag, DollarSign, Medal } from 'lucide-react';
import { useOrdersStore } from '../../store/ordersStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/formatters';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export default function DashboardPage() {
  const { currentUser } = useAuthStore();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(subDays(new Date(), 7)),
    end: endOfDay(new Date()),
  });

  const orders = useOrdersStore(s => s.orders);
  const salesByCashier = React.useMemo(() => {
    const cashierSales: Record<string, { cashierId: string; cashierName: string; totalSales: number; ordersCount: number }> = {};
    
    orders.forEach(order => {
      if (order.status === 'cancelled') return;
      
      const orderDate = new Date(order.createdAt);
      if (orderDate >= dateRange.start && orderDate <= dateRange.end) {
        if (!cashierSales[order.cashierId]) {
          cashierSales[order.cashierId] = {
            cashierId: order.cashierId,
            cashierName: order.cashierName,
            totalSales: 0,
            ordersCount: 0,
          };
        }
        cashierSales[order.cashierId].totalSales += order.total;
        cashierSales[order.cashierId].ordersCount += 1;
      }
    });

    return Object.values(cashierSales).sort((a, b) => b.totalSales - a.totalSales);
  }, [orders, dateRange.start, dateRange.end]);

  const stats = [
    { name: 'إجمالي المبيعات', value: '١٢,٤٥٠ ج.م', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'عدد الطلبات', value: '٤٨', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'متوسط الطلب', value: '٢٥٩ ج.م', icon: TrendingUp, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
    { name: 'العملاء الجدد', value: '١٢', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const maxSales = salesByCashier.length > 0 ? salesByCashier[0].totalSales : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
            <LayoutDashboard className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-slate-400">نظرة عامة على أداء المطعم</p>
          </div>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
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

      {/* ✅ NEW: Staff Performance Section (Admin/Manager only) */}
      {currentUser?.role !== 'cashier' && (
        <div className="bg-[#1a1d26] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Users className="text-purple-500 w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">أداء الموظفين</h2>
            </div>
          </div>

          <div className="p-8">
            {salesByCashier.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 opacity-10 mx-auto mb-4" />
                <p>لا توجد بيانات في هذه الفترة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-slate-400 text-sm border-b border-white/5">
                      <th className="pb-4 font-bold pr-4">الترتيب</th>
                      <th className="pb-4 font-bold">اسم الكاشير</th>
                      <th className="pb-4 font-bold">عدد الطلبات</th>
                      <th className="pb-4 font-bold text-left pl-4">إجمالي المبيعات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {salesByCashier.map((cashier, idx) => {
                      const rank = idx + 1;
                      const percentage = maxSales > 0 ? (cashier.totalSales / maxSales) * 100 : 0;
                      return (
                        <tr key={cashier.cashierId} className="group hover:bg-white/5 transition-colors">
                          <td className="py-6 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-500">#{rank}</span>
                              {rank === 1 && <Medal className="w-5 h-5 text-amber-500" />}
                              {rank === 2 && <Medal className="w-5 h-5 text-slate-400" />}
                              {rank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="font-bold text-lg">{cashier.cashierName}</span>
                          </td>
                          <td className="py-6">
                            <span className="bg-white/5 px-3 py-1 rounded-lg text-sm font-bold">
                              {cashier.ordersCount} طلب
                            </span>
                          </td>
                          <td className="py-6 pl-4">
                            <div className="flex flex-col items-end gap-2">
                              <span className="font-space-mono font-bold text-xl text-[#f59e0b]">
                                {formatCurrency(cashier.totalSales)}
                              </span>
                              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#f59e0b] transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
