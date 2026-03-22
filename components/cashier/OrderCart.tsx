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
import { Trash2, Send, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Order } from '../../types';
import { generateId } from '../../lib/utils';

export default function OrderCart() {
  const { items, clearCart, notes, setNotes, tableNumber, getSubtotal, getDiscountAmount, getTotal, discount, discountType } = useCartStore();
  const { currentUser } = useAuthStore();
  const { addOrder } = useOrdersStore();
  
  const [showPayment, setShowPayment] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSendToKitchen = () => {
    if (items.length === 0) return;
    toast.success('تم إرسال الطلب للمطبخ');
  };

  const handleCompletePayment = (paymentMethod: Order['paymentMethod'], amountPaid?: number) => {
    const subtotal = getSubtotal();
    const total = getTotal();
    
    const newOrder: Order = {
      id: generateId(),
      orderNumber: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      tableNumber: tableNumber || undefined,
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
      paymentMethod,
      amountPaid,
      change: amountPaid ? amountPaid - total : 0,
      status: 'preparing',
      notes,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    setLastOrder(newOrder);
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();
    toast.success('تم إتمام الطلب بنجاح');
  };

  return (
    <div className="bg-[#1a1d26] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TableSelector />
        </div>
        <button 
          onClick={() => {
            if (items.length > 0) {
              if (confirm('هل أنت متأكد من مسح السلة؟')) clearCart();
            }
          }}
          className="text-slate-500 hover:text-red-500 transition-colors p-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <ShoppingCartIcon className="w-12 h-12 mb-4" />
            <p>السلة فارغة</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))
        )}
      </div>

      {/* Summary & Actions */}
      <div className="p-4 bg-black/20 border-t border-white/5 space-y-4">
        <textarea
          placeholder="ملاحظات الطلب..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-[#0f1117] border border-white/5 rounded-xl p-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 resize-none h-20"
        />

        <OrderSummary />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSendToKitchen}
            disabled={items.length === 0}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition-all border border-white/5"
          >
            <Send className="w-5 h-5" />
            <span>للمطبخ</span>
          </button>
          <button
            onClick={() => setShowPayment(true)}
            disabled={items.length === 0}
            className="flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-black transition-all"
          >
            <CreditCard className="w-5 h-5" />
            <span>الدفع</span>
          </button>
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          total={getTotal()} 
          onClose={() => setShowPayment(false)} 
          onConfirm={handleCompletePayment} 
        />
      )}

      {showReceipt && lastOrder && (
        <ReceiptModal 
          order={lastOrder} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
    </div>
  );
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
