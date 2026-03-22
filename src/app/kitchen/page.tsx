'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useOrdersStore } from '../../store/ordersStore';
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { differenceInMinutes } from 'date-fns';
import OrderTicket from '../../components/kitchen/OrderTicket';

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const [now, setNow] = useState(new Date());

  const preparingOrders = useMemo(() => orders.filter(o => o.status === 'preparing'), [orders]);
  
  const readyOrders = useMemo(() => {
    return orders.filter(o => {
      if (o.status === 'ready') return true;
      if (o.status === 'completed' && o.completedAt) {
        const diff = differenceInMinutes(now, new Date(o.completedAt));
        return diff < 2; // ✅ BUG FIX: Completed orders disappear after 2 minutes
      }
      return false;
    });
  }, [orders, now]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-gray-950 text-white flex flex-col md:overflow-hidden font-cairo rounded-3xl border border-white/5">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-white/5 p-4 md:p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f59e0b] text-black rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">شاشة المطبخ</h1>
            <p className="text-slate-500 text-xs font-bold">نظام إدارة الطلبات المباشر</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-4">
          <div className="bg-gray-900 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase">قيد التحضير</span>
            <span className="text-lg md:text-xl font-black text-[#f59e0b]">{preparingOrders.length}</span>
          </div>
          <div className="bg-gray-900 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase">جاهز للتسليم</span>
            <span className="text-lg md:text-xl font-black text-emerald-400">{readyOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 overflow-y-auto md:overflow-hidden">
        {/* Preparing Column */}
        <div className="flex flex-col border-l border-white/5 md:col-span-1 lg:col-span-2 xl:col-span-3 min-h-[400px] md:min-h-0">
          <div className="p-3 bg-amber-500/10 flex items-center gap-2 border-b border-amber-500/20 sticky top-0 z-10 backdrop-blur-md">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-500 animate-pulse" />
            <h2 className="text-base md:text-lg font-black text-amber-500">قيد التحضير</h2>
            <span className="mr-auto bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px] md:text-xs font-black">
              {preparingOrders.length} طلب
            </span>
          </div>
          
          <div className="p-4 md:p-6 md:flex-1 md:overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {preparingOrders.map((order) => (
                  <OrderTicket 
                    key={order.id} 
                    order={order} 
                    onAction={() => updateOrderStatus(order.id, 'ready')}
                    actionLabel="جاهز"
                    actionColor="bg-emerald-500"
                  />
                ))}
              </AnimatePresence>
            </div>
            {preparingOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-20">
                <ChefHat className="w-24 h-24 mb-6 opacity-10" />
                <p className="text-2xl font-black opacity-20">لا توجد طلبات قيد التحضير حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col bg-emerald-500/5 md:col-span-1 min-h-[400px] md:min-h-0 border-t md:border-t-0 border-white/5">
          <div className="p-3 bg-emerald-500/10 flex items-center gap-2 border-b border-emerald-500/20 sticky top-0 z-10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <h2 className="text-base md:text-lg font-black text-emerald-500">جاهز للتسليم</h2>
            <span className="mr-auto bg-emerald-500 text-black px-2 py-0.5 rounded-full text-[10px] md:text-xs font-black">
              {readyOrders.length} طلب
            </span>
          </div>
          
          <div className="p-4 md:p-6 md:flex-1 md:overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {readyOrders.map((order) => (
                  <OrderTicket 
                    key={order.id} 
                    order={order} 
                    onAction={() => updateOrderStatus(order.id, 'completed')}
                    actionLabel="تم التسليم"
                    actionColor="bg-blue-600"
                  />
                ))}
              </AnimatePresence>
            </div>
            {readyOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-10 md:py-20">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-10" />
                <p className="text-base md:text-lg font-black opacity-20 text-center">لا توجد طلبات جاهزة للتسليم</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
