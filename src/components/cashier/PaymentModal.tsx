'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { X, Banknote, CreditCard, Wallet, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, amountPaid?: number) => void;
}

export default function PaymentModal({ total, onClose, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toString());
  const [error, setError] = useState<string | null>(null);

  const change = Math.max(0, Number(amountPaid) - total);
  const isAmountValid = Number(amountPaid) >= total;

  const handleConfirm = () => {
    if (method === 'cash' && !isAmountValid) {
      setError('المبلغ المدفوع أقل من الإجمالي');
      return;
    }
    onConfirm(method, Number(amountPaid));
  };

  const methods = [
    { id: 'cash', name: 'كاش', icon: Banknote, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { id: 'card', name: 'فيزا', icon: CreditCard, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'credit', name: 'آجل', icon: Clock, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { id: 'wallet', name: 'محفظة', icon: Wallet, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl bg-[#11131a] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">إتمام الدفع</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Right Side: Methods (First in RTL) */}
          <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-l border-white/5">
            <p className="text-slate-400 font-black mb-6 text-lg">اختر طريقة الدفع</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {methods.map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={cn(
                      "group relative p-4 md:p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-300 min-h-[120px] md:min-h-[140px]",
                      isActive 
                        ? 'bg-[#f59e0b] border-[#f59e0b] text-black shadow-xl shadow-[#f59e0b]/20 scale-[1.02]' 
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                      isActive ? 'bg-black/10' : m.bgColor
                    )}>
                      <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? 'text-black' : m.color)} />
                    </div>
                    <span className="font-black text-base md:text-lg whitespace-nowrap">{m.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="active-method"
                        className="absolute inset-0 border-2 border-white/20 rounded-3xl pointer-events-none"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Side: Calculations */}
          <div className="w-full md:w-[360px] lg:w-[400px] bg-black/40 p-6 md:p-8 flex flex-col gap-6 shrink-0">
            {/* Total Required */}
            <div className="bg-[#f59e0b]/5 rounded-[2.5rem] p-8 border border-[#f59e0b]/20 text-center">
              <p className="text-slate-500 font-black text-sm mb-3">المبلغ المطلوب</p>
              <p className="text-5xl font-black text-[#f59e0b] font-space-mono leading-tight">
                {formatCurrency(total)}
              </p>
            </div>

            {/* Input for Cash */}
            {method === 'cash' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <p className="text-slate-500 font-black text-sm text-center">المبلغ المدفوع</p>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={amountPaid}
                      onChange={(e) => {
                        setAmountPaid(e.target.value);
                        setError(null);
                      }}
                      className={cn(
                        "w-full bg-[#1a1d26] border-2 rounded-3xl p-6 text-4xl font-black font-space-mono text-center focus:outline-none transition-all",
                        error ? "border-rose-500 text-rose-500" : "border-white/20 text-white focus:border-[#f59e0b]"
                      )}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-rose-500 text-sm font-black text-center animate-pulse">
                      {error}
                    </p>
                  )}
                </div>

                {/* Change */}
                <div className="bg-emerald-500/5 rounded-[2.5rem] p-8 border border-emerald-500/20 text-center">
                  <p className="text-emerald-500/60 font-black text-sm mb-3">المتبقي (الباقي)</p>
                  <p className="text-4xl font-black text-emerald-400 font-space-mono leading-tight">
                    {formatCurrency(change)}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Confirm Button */}
            <div className="mt-auto pt-6">
              <button
                onClick={handleConfirm}
                className="w-full bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-black py-7 rounded-[2rem] text-2xl shadow-2xl shadow-[#f59e0b]/30 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span>تأكيد العملية</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
