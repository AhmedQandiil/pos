'use client';

import React, { useState, useMemo } from 'react';
import { useOrdersStore } from '../../store/ordersStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { Search, Filter, Eye, Printer, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReceiptModal from '../../components/cashier/ReceiptModal';
import { Order } from '../../types';

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrdersStore();
  const { currentUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                           o.tableNumber?.toString() === search;
      const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleCancelOrder = (id: string) => {
    if (currentUser?.role !== 'admin') {
      toast.error('عذراً، صلاحية إلغاء الطلبات للمدير فقط');
      return;
    }
    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      cancelOrder(id);
      toast.success('تم إلغاء الطلب');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">سجل الطلبات</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب أو الطاولة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1d26] border border-white/5 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-[#1a1d26] border border-white/5 p-1 rounded-xl">
          <div className="px-4 text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm font-bold pr-8"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-white/5">
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">الطاولة</th>
                <th className="p-4 font-bold">الوقت</th>
                <th className="p-4 font-bold">الإجمالي</th>
                <th className="p-4 font-bold">الدفع</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{order.orderNumber}</td>
                  <td className="p-4">{order.tableNumber ? `طاولة ${order.tableNumber}` : 'سفري'}</td>
                  <td className="p-4 text-slate-400 text-sm">{formatDateTime(order.createdAt)}</td>
                  <td className="p-4 font-space-mono font-bold text-[#f59e0b]">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/5 rounded-lg text-xs">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                      order.status === 'preparing' ? 'bg-amber-500/10 text-amber-500' :
                      order.status === 'ready' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-all"
                        title="عرض الفاتورة"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {order.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="p-2 hover:bg-white/5 rounded-lg text-red-400 transition-all"
                          title="إلغاء الطلب"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <ReceiptModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
