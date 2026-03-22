'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { X, Banknote, CreditCard, Wallet, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, amountPaid?: number) => void;
}

export default function PaymentModal({ total, onClose, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toString());

  const change = Number(amountPaid) - total;

  const methods = [
    { id: 'cash', name: 'كاش', icon: Banknote, color: 'text-emerald-400' },
    { id: 'card', name: 'فيزا', icon: CreditCard, color: 'text-blue-400' },
    { id: 'wallet', name: 'محفظة', icon: Wallet, color: 'text-purple-400' },
    { id: 'credit', name: 'آجل', icon: Clock, color: 'text-amber-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1d26] w-full max-w-2xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-bold">إتمام الدفع</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Methods */}
          <div className="space-y-4">
            <p className="text-slate-400 font-bold mb-4">اختر طريقة الدفع</p>
            <div className="grid grid-cols-2 gap-3">
              {methods.map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' 
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isActive ? 'text-[#f59e0b]' : m.color}`} />
                    <span className="font-bold">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Calculation */}
          <div className="bg-[#0f1117] rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">المبلغ المطلوب</p>
                <p className="text-3xl font-bold font-space-mono text-[#f59e0b]">{formatCurrency(total)}</p>
              </div>

              {method === 'cash' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">المبلغ المدفوع</p>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full bg-[#1a1d26] border border-white/10 rounded-xl p-4 text-2xl font-bold font-space-mono focus:outline-none focus:border-[#f59e0b]"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-1">المتبقي (الباقي)</p>
                    <p className={`text-2xl font-bold font-space-mono ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(change)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onConfirm(method, Number(amountPaid))}
              disabled={method === 'cash' && Number(amountPaid) < total}
              className="w-full bg-[#f59e0b] text-black font-bold py-4 rounded-xl text-lg mt-8 hover:bg-[#d97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تأكيد العملية
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
