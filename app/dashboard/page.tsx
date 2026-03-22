'use client';

import React, { useState, useMemo } from 'react';
import { useOrdersStore } from '../../store/ordersStore';
import { useExpensesStore } from '../../store/expensesStore';
import StatsCard from '../../components/dashboard/StatsCard';
import SalesChart from '../../components/dashboard/SalesChart';
import ExpensesChart from '../../components/dashboard/ExpensesChart';
import TopProducts from '../../components/dashboard/TopProducts';
import RecentOrders from '../../components/dashboard/RecentOrders';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import { DollarSign, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import { subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export default function DashboardPage() {
  const { orders } = useOrdersStore();
  const { expenses } = useExpensesStore();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(subDays(new Date(), 7)),
    end: endOfDay(new Date()),
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => 
      isWithinInterval(new Date(o.createdAt), { start: dateRange.start, end: dateRange.end }) &&
      o.status !== 'cancelled'
    );
  }, [orders, dateRange]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => 
      isWithinInterval(new Date(e.date), { start: dateRange.start, end: dateRange.end })
    );
  }, [expenses, dateRange]);

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const ordersCount = filteredOrders.length;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="إجمالي المبيعات" 
          value={totalSales} 
          icon={DollarSign} 
          trend="+١٢٪" 
          color="text-emerald-400" 
        />
        <StatsCard 
          title="إجمالي المصاريف" 
          value={totalExpenses} 
          icon={Wallet} 
          trend="+٥٪" 
          color="text-rose-400" 
        />
        <StatsCard 
          title="صافي الربح" 
          value={netProfit} 
          icon={TrendingUp} 
          trend="+٨٪" 
          color={netProfit >= 0 ? "text-emerald-400" : "text-rose-400"} 
        />
        <StatsCard 
          title="عدد الطلبات" 
          value={ordersCount} 
          icon={ShoppingBag} 
          trend="+١٥٪" 
          color="text-blue-400" 
          isCurrency={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart orders={filteredOrders} expenses={filteredExpenses} />
        </div>
        <div>
          <ExpensesChart expenses={filteredExpenses} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopProducts orders={filteredOrders} />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders orders={filteredOrders.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
}
