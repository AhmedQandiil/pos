'use client';

import React, { useState, useMemo } from 'react';
import { useOrdersStore } from '../../store/ordersStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { Search, Filter, Eye, Printer, XCircle, Calendar, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReceiptModal from '../../components/cashier/ReceiptModal';
import { Order } from '../../types';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import { isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns';

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrdersStore();
  const { currentUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCashierId, setSelectedCashierId] = useState<string | null>(null); // ✅ NEW
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false); // ✅ RESPONSIVE FIX
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(subDays(new Date(), 7)),
    end: endOfDay(new Date()),
  });

  // ✅ NEW: Filter orders based on role
  const visibleOrders = useMemo(() => {
    if (currentUser?.role === 'cashier') {
      return orders.filter(o => o.cashierId === currentUser.id);
    }
    return orders; // admin + manager see all
  }, [orders, currentUser]);

  // ✅ NEW: Get unique cashiers from ALL orders
  const cashierList = useMemo(() => {
    const map = new Map<string, string>();
    orders.forEach(o => map.set(o.cashierId, o.cashierName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return visibleOrders.filter((o) => { // ✅ UPDATED: Use visibleOrders
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                           o.tableNumber?.toString() === search;
      const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
      const matchesDate = isWithinInterval(new Date(o.createdAt), { start: dateRange.start, end: dateRange.end });
      const matchesCashier = !selectedCashierId ? true : o.cashierId === selectedCashierId; // ✅ NEW
      return matchesSearch && matchesStatus && matchesDate && matchesCashier;
    });
  }, [visibleOrders, search, statusFilter, dateRange, selectedCashierId]); // ✅ UPDATED: Dependencies

  const handleCancelOrder = (id: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') { // ✅ BUG FIX
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">سجل الطلبات</h1> {/* ✅ RESPONSIVE FIX */}
        <div className="flex items-center gap-2"> {/* ✅ RESPONSIVE FIX */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-3 bg-[#1a1d26] border border-white/5 rounded-xl text-slate-400"
          >
            <Filter className="w-5 h-5" />
          </button>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4`}> {/* ✅ RESPONSIVE FIX */}
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب أو الطاولة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1d26] border border-white/5 rounded-xl py-4 md:py-3 pr-12 pl-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all text-lg md:text-base" // ✅ RESPONSIVE FIX
          />
        </div>
        
        <div className="flex items-center gap-2 bg-[#1a1d26] border border-white/5 p-1 rounded-xl">
          <div className="px-4 text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-base md:text-sm font-bold pr-8 min-h-[48px] md:min-h-0 w-full md:w-auto" // ✅ RESPONSIVE FIX
          >
            <option value="all">كل الحالات</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* ✅ NEW: Cashier Filter Dropdown (Admin/Manager only) */}
        {currentUser?.role !== 'cashier' && (
          <div className="flex items-center gap-2 bg-[#1a1d26] border border-white/5 p-1 rounded-xl relative">
            <div className="px-4 text-slate-400">
              <Users className="w-4 h-4" />
            </div>
            <select
              value={selectedCashierId || ''}
              onChange={(e) => setSelectedCashierId(e.target.value || null)}
              className="bg-transparent border-none focus:ring-0 text-base md:text-sm font-bold pr-8 min-h-[48px] md:min-h-0 w-full md:w-auto"
            >
              <option value="">كل الكاشيرات</option>
              {cashierList.map((cashier) => (
                <option key={cashier.id} value={cashier.id}>{cashier.name}</option>
              ))}
            </select>
            {selectedCashierId && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#f59e0b] rounded-full border-2 border-[#1a1d26]" />
            )}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg"> {/* ✅ RESPONSIVE FIX */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-white/5">
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">الطلب</th>
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
                  <td className="p-4">
                    <div className="max-w-[200px] text-xs space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="truncate">
                          <span className="text-[#f59e0b] font-bold ml-1">{item.quantity}x</span>
                          <span>{item.productName}</span>
                        </div>
                      ))}
                    </div>
                  </td>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4"> {/* ✅ RESPONSIVE FIX */}
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => setSelectedOrder(order)}
            className="bg-[#1a1d26] border border-white/5 rounded-2xl p-4 space-y-4 active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  #{order.orderNumber} {order.tableNumber ? `• طاولة ${order.tableNumber}` : '• سفري'}
                </h3>
                <p className="text-slate-400 text-sm">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="text-left">
                <p className="font-space-mono font-bold text-[#f59e0b] text-lg">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="text-sm text-slate-400 line-clamp-1">
              {order.items.map(item => `${item.quantity}x ${item.productName}`).join('، ')}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                  order.status === 'preparing' ? 'bg-amber-500/10 text-amber-500' :
                  order.status === 'ready' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-slate-400">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                </span>
              </div>
              
              {order.status !== 'cancelled' && (currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelOrder(order.id);
                  }}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-[#1a1d26] rounded-2xl border border-white/5">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-400">لا توجد طلبات مطابقة للبحث</p>
          </div>
        )}
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
