'use client';

import React from 'react';
import { OrderItem } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { X, Send, ShoppingBag, Check, ChevronLeft, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';

interface KitchenConfirmModalProps {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFees: number;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function KitchenConfirmModal({ 
  items, subtotal, discount, deliveryFees, total, onClose, onConfirm 
}: KitchenConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Backdrop (Only visible on desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl hidden md:block"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full h-full md:w-[95%] md:max-w-2xl md:h-auto md:max-h-[85vh] bg-[#0f1117] md:rounded-[2.5rem] md:border border-white/10 overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-5 md:p-8 flex items-center justify-between shrink-0 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Send className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">تأكيد إرسال الطلب</h2>
              <p className="text-slate-500 text-xs md:text-sm font-bold">راجع الطلب قبل إرساله للمطبخ</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/5 rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-white border border-white/5"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest px-1">محتويات الطلب</p>
            <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#f59e0b] font-black text-sm">
                      {item.quantity}
                    </span>
                    <span className="font-bold text-sm">{item.productName}</span>
                  </div>
                  <span className="font-space-mono font-bold text-sm">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-black/40 rounded-2xl p-5 border border-white/5">
            <div className="flex justify-between text-sm text-slate-400">
              <span>الإجمالي الفرعي</span>
              <span className="font-space-mono">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-rose-400">
                <span>الخصم</span>
                <span className="font-space-mono">-{formatCurrency(discount)}</span>
              </div>
            )}
            {deliveryFees > 0 && (
              <div className="flex justify-between text-sm text-slate-400">
                <span>رسوم التوصيل</span>
                <span className="font-space-mono">{formatCurrency(deliveryFees)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black text-[#f59e0b] pt-3 border-t border-white/5">
              <span>الإجمالي النهائي</span>
              <span className="font-space-mono">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 md:p-8 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl text-slate-400 font-black hover:bg-white/5 transition-all border border-white/5"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] py-4 md:py-5 rounded-xl md:rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span>تأكيد وإرسال للمطبخ</span>
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
