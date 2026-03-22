'use client';

import React, { useEffect, useMemo } from 'react';
import { useOrdersStore } from '../../store/ordersStore';
import { formatTime } from '../../lib/formatters';
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { differenceInMinutes } from 'date-fns';

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useOrdersStore();

  const preparingOrders = useMemo(() => orders.filter(o => o.status === 'preparing'), [orders]);
  const readyOrders = useMemo(() => orders.filter(o => o.status === 'ready'), [orders]);

  // Auto refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to trigger re-render for timers
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f59e0b] text-black rounded-2xl flex items-center justify-center">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">شاشة المطبخ</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1a1d26] px-6 py-3 rounded-2xl border border-white/5">
            <span className="text-slate-400 text-sm ml-2">قيد التحضير:</span>
            <span className="text-2xl font-bold text-[#f59e0b]">{preparingOrders.length}</span>
          </div>
          <div className="bg-[#1a1d26] px-6 py-3 rounded-2xl border border-white/5">
            <span className="text-slate-400 text-sm ml-2">جاهز للتسليم:</span>
            <span className="text-2xl font-bold text-emerald-400">{readyOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Preparing Column */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-amber-500 font-bold px-2">
            <Clock className="w-5 h-5" />
            <h2>قيد التحضير</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
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
            {preparingOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
                <ChefHat className="w-12 h-12 mb-4 opacity-20" />
                <p>لا توجد طلبات قيد التحضير</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-500 font-bold px-2">
            <CheckCircle2 className="w-5 h-5" />
            <h2>جاهز للتسليم</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <AnimatePresence mode="popLayout">
              {readyOrders.map((order) => (
                <OrderTicket 
                  key={order.id} 
                  order={order} 
                  onAction={() => updateOrderStatus(order.id, 'completed')}
                  actionLabel="تم التسليم"
                  actionColor="bg-blue-500"
                />
              ))}
            </AnimatePresence>
            {readyOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
                <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                <p>لا توجد طلبات جاهزة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTicket({ order, onAction, actionLabel, actionColor }: { order: any, onAction: () => void, actionLabel: string, actionColor: string }) {
  const minutes = differenceInMinutes(new Date(), new Date(order.createdAt));
  const isLate = minutes >= 10;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-[#1a1d26] rounded-3xl border border-white/5 overflow-hidden shadow-xl"
    >
      <div className={`p-4 flex justify-between items-center ${isLate ? 'bg-red-500/20' : 'bg-white/5'}`}>
        <div>
          <span className="text-xs text-slate-400 block mb-1">رقم الطلب</span>
          <span className="text-2xl font-bold font-space-mono">{order.orderNumber.split('-')[1]}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">الطاولة</span>
          <span className="text-2xl font-bold">{order.tableNumber ? `طاولة ${order.tableNumber}` : 'سفري'}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <ul className="space-y-3">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-bold font-space-mono">
                  {item.quantity}
                </span>
                <span className="font-bold text-lg">{item.productName}</span>
              </div>
            </li>
          ))}
        </ul>

        {order.notes && (
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            <p className="text-xs text-amber-500 font-bold mb-1">ملاحظات:</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isLate ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`font-space-mono font-bold ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
              {minutes} دقيقة
            </span>
          </div>
          <button
            onClick={onAction}
            className={`${actionColor} text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all active:scale-95`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
