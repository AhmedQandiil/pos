'use client';

import React, { useMemo } from 'react';
import { Order } from '../../types';
import { formatCurrency, formatNumber } from '../../lib/formatters';

interface TopProductsProps {
  orders: Order[];
}

export default function TopProducts({ orders }: TopProductsProps) {
  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        counts[item.productId].quantity += item.quantity;
        counts[item.productId].revenue += item.total;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold mb-6">الأكثر مبيعاً</h3>
      <div className="space-y-4">
        {topProducts.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#f59e0b]/10 text-[#f59e0b] rounded-lg flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-xs text-slate-400">{formatNumber(p.quantity)} قطعة</p>
              </div>
            </div>
            <span className="font-space-mono font-bold text-emerald-400">
              {formatCurrency(p.revenue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
