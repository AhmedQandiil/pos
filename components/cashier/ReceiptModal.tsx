'use client';

import React from 'react';
import { Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { APP_NAME, PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { X, Printer } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white text-black w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Actions (Hidden on print) */}
        <div className="p-4 bg-[#1a1d26] text-white flex justify-between items-center print:hidden">
          <h3 className="font-bold">معاينة الفاتورة</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 bg-[#f59e0b] text-black rounded-lg hover:bg-[#d97706] transition-all">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div id="receipt-content" className="p-8 font-cairo print:p-0">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
              POS
            </div>
            <h2 className="text-xl font-bold">{APP_NAME}</h2>
            <p className="text-sm text-gray-500">فرع القاهرة - مدينة نصر</p>
            <p className="text-sm text-gray-500">ت: ٠١٠٠٠٠٠٠٠٠٠</p>
          </div>

          <div className="border-y border-dashed border-gray-300 py-3 mb-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>رقم الفاتورة:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>التاريخ:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>الكاشير:</span>
              <span>{order.cashierName}</span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between">
                <span>رقم الطاولة:</span>
                <span className="font-bold">{order.tableNumber}</span>
              </div>
            )}
          </div>

          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-200 text-right">
                <th className="py-2">الصنف</th>
                <th className="py-2 text-center">الكمية</th>
                <th className="py-2 text-left">السعر</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-left font-space-mono">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 text-sm mb-6">
            <div className="flex justify-between">
              <span>الإجمالي الفرعي:</span>
              <span className="font-space-mono">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>الخصم:</span>
                <span className="font-space-mono">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>الإجمالي النهائي:</span>
              <span className="font-space-mono">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 text-center">
            <p className="text-sm font-bold mb-1">طريقة الدفع: {PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            {order.paymentMethod === 'cash' && (
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>المدفوع:</span>
                  <span>{formatCurrency(order.amountPaid || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>الباقي:</span>
                  <span>{formatCurrency(order.change || 0)}</span>
                </div>
              </div>
            )}
            <p className="text-sm mt-6 font-bold italic">شكراً لزيارتكم!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
