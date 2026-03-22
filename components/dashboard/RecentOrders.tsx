'use client';

import React from 'react';
import { Order } from '../../types';
import { formatCurrency, formatTime } from '../../lib/formatters';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '../../lib/constants';

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 shadow-lg overflow-hidden">
      <h3 className="font-bold mb-6">آخر الطلبات</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="text-slate-400 text-sm border-b border-white/5">
              <th className="pb-4 font-bold">رقم الطلب</th>
              <th className="pb-4 font-bold">الوقت</th>
              <th className="pb-4 font-bold">الإجمالي</th>
              <th className="pb-4 font-bold">الدفع</th>
              <th className="pb-4 font-bold">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm hover:bg-white/5 transition-colors">
                <td className="py-4 font-bold">{order.orderNumber}</td>
                <td className="py-4 text-slate-400">{formatTime(order.createdAt)}</td>
                <td className="py-4 font-space-mono font-bold text-[#f59e0b]">{formatCurrency(order.total)}</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-white/5 rounded-lg text-xs">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                    order.status === 'preparing' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
