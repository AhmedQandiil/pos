'use client';

import React, { useMemo } from 'react';
import { Expense } from '../../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { EXPENSE_CATEGORY_LABELS } from '../../lib/constants';

interface ExpensesChartProps {
  expenses: Expense[];
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#fb7185', '#8b5cf6'];

export default function ExpensesChart({ expenses }: ExpensesChartProps) {
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    return Object.entries(categoryTotals).map(([cat, total]) => ({
      name: EXPENSE_CATEGORY_LABELS[cat] || cat,
      value: total,
    }));
  }, [expenses]);

  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 shadow-lg h-[400px] flex flex-col">
      <h3 className="font-bold mb-6">توزيع المصاريف</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1d26', border: '1px solid #ffffff10', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
