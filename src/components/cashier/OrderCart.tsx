'use client';

import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore } from '../../store/ordersStore';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import TableSelector from './TableSelector';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';
import KitchenConfirmModal from './KitchenConfirmModal';
import { usePaymentStore } from '../../store/paymentStore'; // ✅ NEW
import { Trash2, Send, CreditCard, X, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Order } from '../../types';
import { generateId } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface OrderCartProps {
  onClose?: () => void;
}

export default function OrderCart({ onClose }: OrderCartProps) {
  const { 
    items, clearCart, notes, setNotes, tableNumber, subtotal, 
    total, discount, discountType, orderType, deliveryFees 
  } = useCartStore();
  const { currentUser } = useAuthStore();
  const { addOrder } = useOrdersStore();
  const { openPayment } = usePaymentStore(); // ✅ NEW
  
  const [showKitchenConfirm, setShowKitchenConfirm] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSendToKitchen = () => {
    if (items.length === 0) return;
    
    const newOrder: Order = {
      id: generateId(),
      orderNumber: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      tableNumber: tableNumber || undefined,
      orderType,
      deliveryFees,
      cashierId: currentUser?.id || '',
      cashierName: currentUser?.name || '',
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal,
      discount,
      discountType,
      total,
      paymentMethod: 'cash', // Default to cash for now
      status: 'preparing',
      notes,
      createdAt: new Date(),
    };

    addOrder(newOrder);
    clearCart();
    toast.success('تم إرسال الطلب للمطبخ');
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1d26] md:bg-transparent overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من مسح السلة؟')) clearCart();
              }}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors touch-feedback"
              title="مسح السلة"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          <div>
            <h2 className="font-black text-xl leading-tight">الطلب الحالي</h2>
            <p className="text-sm text-slate-500 font-bold">{items.length} منتجات</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <TableSelector />
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors md:hidden touch-feedback"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 no-scrollbar scroll-touch min-h-0">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 gap-4">
            <ShoppingCartIcon className="w-12 h-12 md:w-16 md:h-16" />
            <p className="text-sm md:text-lg">السلة فارغة</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))
        )}
      </div>

      {/* Summary & Actions */}
      <div className="p-4 md:p-6 bg-black/40 md:bg-transparent border-t border-white/5 space-y-4 shrink-0 pb-10 lg:pb-6">
        <textarea
          placeholder="ملاحظات الطلب..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-[#0f1117] border border-white/5 rounded-xl p-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 resize-none h-16 md:h-20"
        />

        <OrderSummary />

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowKitchenConfirm(true)}
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-black transition-all border border-white/10 touch-feedback group"
          >
            <Send className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-xs md:text-sm">للمطبخ</span>
          </button>
          <button
            onClick={() => {
              openPayment();
              if (onClose) onClose();
            }} // ✅ NEW: Use store action and close drawer
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-black text-black transition-all shadow-xl shadow-[#f59e0b]/20 touch-feedback"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-xs md:text-sm">إتمام الطلب</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showKitchenConfirm && (
          <KitchenConfirmModal 
            items={items.map(item => ({
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.product.price,
              total: item.product.price * item.quantity
            }))}
            subtotal={subtotal}
            discount={discount}
            deliveryFees={deliveryFees}
            total={total}
            onClose={() => setShowKitchenConfirm(false)}
            onConfirm={() => {
              handleSendToKitchen();
              setShowKitchenConfirm(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReceipt && lastOrder && (
          <ReceiptModal 
            order={lastOrder} 
            onClose={() => setShowReceipt(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

