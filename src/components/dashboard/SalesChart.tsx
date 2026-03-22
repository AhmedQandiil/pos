'use client';

import React from 'react';
import { Order, Expense } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SalesChartProps {
  orders: Order[];
  expenses: Expense[];
}

export default function SalesChart({ orders, expenses }: SalesChartProps) {
  const data = useMemo(() => {
    const dailyData: Record<string, { date: string; sales: number; expenses: number }> = {};
    
    orders.forEach((o) => {
      const day = format(o.createdAt, 'yyyy-MM-dd');
      if (!dailyData[day]) dailyData[day] = { date: day, sales: 0, expenses: 0 };
      dailyData[day].sales += o.total;
    });

    expenses.forEach((e) => {
      const day = format(e.date, 'yyyy-MM-dd');
      if (!dailyData[day]) dailyData[day] = { date: day, sales: 0, expenses: 0 };
      dailyData[day].expenses += e.amount;
    });

    return Object.values(dailyData)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        ...d,
        name: format(new Date(d.date), 'EEE d MMM', { locale: ar }),
        profit: d.sales - d.expenses
      }));
  }, [orders, expenses]);

  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 shadow-lg h-[400px] flex flex-col">
      <h3 className="font-bold mb-6">تحليل المبيعات والمصاريف</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              reversed
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
              orientation="right"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid #ffffff10', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar dataKey="sales" name="المبيعات" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="المصاريف" fill="#fb7185" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="الربح" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
