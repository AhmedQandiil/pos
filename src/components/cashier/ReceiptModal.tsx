'use client';

import React, { useState } from 'react';
import { Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { APP_NAME, PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { X, Printer, Settings as SettingsIcon, QrCode, Type, Plus, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore } from '../../store/settingsStore';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../lib/utils';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const { settings } = useSettingsStore();
  const [footerText, setFooterText] = useState(settings.receiptFooter || 'شكراً لزيارتكم!');
  const [qrContent, setQrContent] = useState(settings.qrCodeContent || `Order: ${order.orderNumber}`);
  const [showOptions, setShowOptions] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden">
      {/* Backdrop (Only visible on desktop) */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md hidden md:block print:hidden" onClick={onClose} />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full h-full md:w-[95%] md:max-w-4xl md:h-[90vh] bg-[#0f1117] text-white md:rounded-3xl overflow-hidden flex flex-col print:h-auto print:w-full print:rounded-none shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="p-4 md:p-6 bg-[#1a1d26] border-b border-white/5 flex justify-between items-center shrink-0 print:hidden">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f59e0b] text-black rounded-xl flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
              <Printer className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm md:text-xl">معاينة الفاتورة</h3>
              <p className="text-[10px] md:text-sm text-slate-400 font-bold">تخصيص وطباعة الفاتورة</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowOptions(!showOptions)} 
              className={cn(
                "p-2 md:px-4 md:py-2 rounded-xl transition-all flex items-center gap-2 font-black text-xs md:text-sm border border-white/5",
                showOptions ? 'bg-[#f59e0b] text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              )}
            >
              <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">تخصيص</span>
            </button>
            <button onClick={handlePrint} className="p-2 md:px-4 md:py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 font-black text-xs md:text-sm border border-white/5">
              <Printer className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">طباعة</span>
            </button>
            <button onClick={onClose} className="p-2 md:hidden bg-white/5 text-slate-400 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Options Panel (Hidden on print) */}
          <AnimatePresence>
            {showOptions && (
              <motion.div 
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-full md:w-80 bg-[#1a1d26] border-l border-white/5 p-5 md:p-6 space-y-6 overflow-y-auto print:hidden shrink-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#f59e0b]">
                    <Type className="w-5 h-5" />
                    <h4 className="font-black">نص التذييل</h4>
                  </div>
                  <textarea
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f59e0b] outline-none min-h-[100px] resize-none font-bold"
                    placeholder="اكتب نص تذييل الفاتورة هنا..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#f59e0b]">
                    <QrCode className="w-5 h-5" />
                    <h4 className="font-black">محتوى QR Code</h4>
                  </div>
                  <input
                    type="text"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-[#f59e0b] outline-none font-bold"
                    placeholder="رابط أو نص للـ QR Code..."
                  />
                  <p className="text-[10px] text-slate-500 font-bold">
                    يمكنك وضع رابط موقع المطعم أو كود الطلب أو أي نص آخر.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Receipt Preview */}
          <div className="flex-1 bg-slate-900/50 p-4 md:p-8 overflow-y-auto flex justify-center items-start print:bg-white print:p-0 no-scrollbar">
            <div id="receipt-content" className="w-full max-w-[80mm] bg-white text-black p-6 shadow-2xl font-cairo print:shadow-none print:w-full rounded-sm md:rounded-none">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-2xl">
                  POS
                </div>
                <h2 className="text-xl font-black">{settings.restaurantName}</h2>
                <p className="text-sm text-gray-500 font-bold">{settings.address}</p>
                <p className="text-sm text-gray-500 font-bold">ت: {settings.phoneNumber}</p>
              </div>

              <div className="border-y border-dashed border-gray-300 py-3 mb-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold">رقم الفاتورة:</span>
                  <span className="font-black">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">التاريخ:</span>
                  <span className="font-bold">{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">الكاشير:</span>
                  <span className="font-bold">{order.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">نوع الطلب:</span>
                  <span className="font-black">
                    {order.orderType === 'takeaway' ? (order.tableNumber ? `طاولة ${order.tableNumber}` : 'تيك أواي') : 'دليفري'}
                  </span>
                </div>
              </div>

              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-200 text-right">
                    <th className="py-2 font-black">الصنف</th>
                    <th className="py-2 text-center font-black">الكمية</th>
                    <th className="py-2 text-left font-black">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 font-bold">{item.productName}</td>
                      <td className="py-2 text-center font-black">{item.quantity}</td>
                      <td className="py-2 text-left font-space-mono font-black">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="font-bold">الإجمالي الفرعي:</span>
                  <span className="font-space-mono font-black">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span className="font-bold">الخصم:</span>
                    <span className="font-space-mono font-black">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                {order.deliveryFees > 0 && (
                  <div className="flex justify-between">
                    <span className="font-bold">رسوم التوصيل:</span>
                    <span className="font-space-mono font-black">{formatCurrency(order.deliveryFees)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-200">
                  <span>الإجمالي النهائي:</span>
                  <span className="font-space-mono">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 text-center">
                <p className="text-sm font-black mb-1">طريقة الدفع: {PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
                {order.paymentMethod === 'cash' && (
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="font-bold">المدفوع:</span>
                      <span className="font-black">{formatCurrency(order.amountPaid || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">الباقي:</span>
                      <span className="font-black">{formatCurrency(order.change || 0)}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  <p className="text-sm font-bold italic whitespace-pre-wrap">{footerText}</p>
                  
                  <div className="flex justify-center pt-2">
                    <QRCodeSVG 
                      value={qrContent} 
                      size={100}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer for New Order Button */}
        <div className="p-4 md:p-8 bg-black/40 border-t border-white/5 shrink-0 print:hidden">
          <button 
            onClick={onClose} 
            className="w-full py-4 md:py-6 bg-[#f59e0b] text-black rounded-xl md:rounded-[2rem] hover:bg-[#fbbf24] transition-all flex items-center justify-center gap-3 font-black text-lg md:text-2xl shadow-xl shadow-[#f59e0b]/20 active:scale-95"
          >
            <Plus className="w-6 h-6 md:w-8 md:h-8" />
            <span>طلب جديد</span>
          </button>
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standard receipt width */
            margin: 0;
            padding: 5mm;
            box-shadow: none;
          }
        }
      ` }} />
    </div>
  );
}
