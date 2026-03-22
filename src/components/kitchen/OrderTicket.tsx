'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { differenceInMinutes } from 'date-fns';

interface OrderTicketProps {
  order: Order;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
}

export default function OrderTicket({ order, onAction, actionLabel, actionColor }: OrderTicketProps) {
  const [minutes, setMinutes] = useState(differenceInMinutes(new Date(), new Date(order.createdAt)));

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(differenceInMinutes(new Date(), new Date(order.createdAt)));
    }, 10000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isLate = minutes >= 5 && minutes < 10;
  const isVeryLate = minutes >= 10;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-[#1a1d26] rounded-3xl border-2 border-white/5 overflow-hidden shadow-2xl flex flex-col h-full"
    >
      {/* Table Number Header - Responsive Sizing */}
      <div className={`p-3 md:p-4 text-center border-b border-white/5 relative overflow-hidden ${isVeryLate ? 'bg-red-500/20' : isLate ? 'bg-amber-500/20' : 'bg-white/5'}`}>
        <div className="relative z-10">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5 block">
            {order.tableNumber ? 'طاولة' : 'نوع الطلب'}
          </span>
          <h2 className="text-xl md:text-3xl font-black mb-1 text-white">
            {order.tableNumber ? `${order.tableNumber}` : order.orderType === 'delivery' ? 'ديلفري' : 'سفري'}
          </h2>
          <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="text-amber-500 font-black text-[10px] md:text-xs uppercase tracking-tighter">
              كود: {order.orderNumber}
            </span>
          </div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="absolute -bottom-2 -right-2 text-white/5 text-6xl font-black select-none pointer-events-none transform rotate-12">
          {order.orderNumber.split('-')[1]}
        </div>
      </div>

      <div className="p-3 md:p-5 flex-1 flex flex-col gap-3 md:gap-5">
        {/* Items List */}
        <ul className="space-y-2 md:space-y-3 flex-1">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 md:gap-3">
              <span className="w-7 h-7 md:w-9 md:h-9 bg-white/10 rounded-lg flex items-center justify-center font-black text-base md:text-lg text-[#f59e0b] shrink-0">
                {item.quantity}
              </span>
              <div className="flex-1 pt-0.5">
                <span className="text-base md:text-lg font-bold leading-tight block">{item.productName}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Order Notes - Highlighted */}
        {order.notes && (
          <div className="bg-amber-500/20 p-2.5 md:p-3.5 rounded-xl border border-amber-500/30 flex gap-2 md:gap-3 items-start">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[9px] md:text-[11px] text-amber-500 font-black uppercase tracking-wider mb-0.5">ملاحظات الطلب:</p>
              <p className="text-sm md:text-base font-bold leading-snug">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Footer with Timer and Action */}
        <div className="space-y-2 md:space-y-3 pt-2 md:pt-3 border-t border-white/5">
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-4 h-4 md:w-5 md:h-5 ${isVeryLate ? 'text-red-500 animate-pulse' : isLate ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-lg md:text-xl font-black font-space-mono ${isVeryLate ? 'text-red-500' : isLate ? 'text-amber-500' : 'text-white'}`}>
              {minutes} دقيقة
            </span>
          </div>

          <button
            onClick={onAction}
            className={`w-full min-h-[48px] md:min-h-[64px] ${actionColor} text-white text-lg md:text-xl font-black rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
