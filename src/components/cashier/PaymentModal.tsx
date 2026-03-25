'use client'; // ✅ NEW

import React, { useState, useEffect } from 'react'; // ✅ NEW
import { motion, AnimatePresence } from 'motion/react'; // ✅ NEW
import { X, ChevronLeft, ChevronRight, Printer, Check, Wallet, CreditCard, Banknote, ClipboardList } from 'lucide-react'; // ✅ NEW
import { useCartStore } from '../../store/cartStore'; // ✅ NEW
import { useOrdersStore } from '../../store/ordersStore'; // ✅ NEW
import { useAuthStore } from '../../store/authStore'; // ✅ NEW
import { usePaymentStore, PaymentMethod } from '../../store/paymentStore'; // ✅ NEW
import { useKitchenStore } from '../../store/kitchenStore'; // ✅ NEW
import { formatCurrency } from '../../lib/formatters'; // ✅ NEW
import { ReceiptPreview } from './ReceiptPreview'; // ✅ NEW
import { toast } from 'react-hot-toast'; // ✅ NEW

const PaymentModal: React.FC = () => { // ✅ NEW
  const { isOpen, closePayment, currentStep, setStep, selectedMethod, setMethod, amountPaid, setAmountPaid, reset } = usePaymentStore();
  const { items, subtotal, discountAmount, total, tableNumber, orderType, deliveryFees, discount, discountType, notes, clearCart } = useCartStore();
  const { addOrder } = useOrdersStore();
  const { currentUser } = useAuthStore();
  const { addTicket } = useKitchenStore();

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowCloseConfirm(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (currentStep === 3) {
      closePayment();
      reset();
    } else {
      setShowCloseConfirm(true);
    }
  };

  const confirmClose = () => {
    closePayment();
    reset();
    setShowCloseConfirm(false);
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (selectedMethod === 'cash' && amountPaid < total) {
        setError('المبلغ المدفوع أقل من الإجمالي ⚠️');
        return;
      }
      setStep(3);
    }
  };

  const handleConfirmOrder = () => {
    if (!currentUser) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    const orderId = crypto.randomUUID();
    const change = selectedMethod === 'cash' ? Math.max(0, amountPaid - total) : 0;

    const orderData = {
      id: orderId,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal,
      discount: discountAmount,
      discountType,
      total,
      paymentMethod: selectedMethod as any,
      amountPaid: selectedMethod === 'cash' ? amountPaid : total,
      change,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      tableNumber: tableNumber || undefined,
      orderType,
      deliveryFees,
      status: 'preparing' as const,
      notes,
      createdAt: new Date()
    };

    // 1. Add to orders store
    addOrder(orderData);

    // 2. Add to kitchen store
    addTicket({
      id: crypto.randomUUID(),
      orderId: orderId,
      orderNumber: (useOrdersStore.getState().lastOrderNumber).toString(), // This will be updated by addOrder
      tableNumber: tableNumber ? tableNumber.toString() : undefined,
      items: items.map(i => ({
        name: i.product.name,
        quantity: i.quantity,
        notes: i.notes
      })),
      notes: notes,
      status: 'preparing',
      createdAt: new Date(),
      readyAt: null
    });

    // 3. Clear cart
    clearCart();

    // 4. Close modal and reset
    closePayment();
    reset();

    // 5. Success toast
    toast.success('✅ تم إرسال الطلب للمطبخ');
  };

  const handlePrint = () => {
    window.print();
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4"> {/* ✅ NEW */}
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm hidden sm:block"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-[#1a1d2e] w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1a1d2e] z-10">
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${currentStep === step ? 'bg-amber-500 text-white' : currentStep > step ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'}
                `}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step ? 'bg-green-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Step Labels */}
        <div className="px-6 py-2 flex justify-between text-[10px] text-white/40 uppercase tracking-widest border-b border-white/5">
          <span className={currentStep === 1 ? 'text-amber-500' : ''}>طريقة الدفع</span>
          <span className={currentStep === 2 ? 'text-amber-500' : ''}>تفاصيل الطلب</span>
          <span className={currentStep === 3 ? 'text-amber-500' : ''}>الفاتورة</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-12 custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white text-center">كيف سيدفع العميل؟</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'cash', label: 'كاش', icon: <Banknote className="w-8 h-8" />, color: 'amber' },
                    { id: 'card', label: 'فيزا', icon: <CreditCard className="w-8 h-8" />, color: 'blue' },
                    { id: 'wallet', label: 'محفظة', icon: <Wallet className="w-8 h-8" />, color: 'purple' },
                    { id: 'credit', label: 'آجل', icon: <ClipboardList className="w-8 h-8" />, color: 'gray' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setMethod(method.id as PaymentMethod)}
                      className={`
                        flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all min-h-[120px]
                        ${selectedMethod === method.id 
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500' 
                          : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <div className={selectedMethod === method.id ? 'text-amber-500' : 'text-white/40'}>
                        {method.icon}
                      </div>
                      <span className="font-bold text-lg">{method.label}</span>
                      {selectedMethod === method.id && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white text-center">مراجعة الطلب</h2>

                {/* Items List */}
                <div className="bg-white/5 rounded-xl p-4 max-h-48 overflow-y-auto space-y-3 border border-white/5">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{item.product.name}</span>
                        <span className="text-white/40 text-xs">{item.quantity} × {formatCurrency(item.product.price)}</span>
                      </div>
                      <span className="text-white font-mono">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/60">
                    <span>الإجمالي الفرعي:</span>
                    <span className="font-mono">{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>الخصم:</span>
                      <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {deliveryFees > 0 && (
                    <div className="flex justify-between text-white/60">
                      <span>رسوم التوصيل:</span>
                      <span className="font-mono">{formatCurrency(deliveryFees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-bold text-amber-500 pt-2">
                    <span>المبلغ المطلوب:</span>
                    <span className="font-mono">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Amount Paid Section */}
                {selectedMethod === 'cash' ? (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <label className="block text-center text-white/70 font-bold">المبلغ المدفوع من العميل</label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={amountPaid || ''}
                        onChange={(e) => {
                          setAmountPaid(parseFloat(e.target.value) || 0);
                          setError(null);
                        }}
                        placeholder="أدخل المبلغ..."
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-3xl text-center text-white font-bold focus:border-amber-500 outline-none transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setAmountPaid(amount);
                            setError(null);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          {amount} ج
                        </button>
                      ))}
                    </div>

                    {amountPaid >= total ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <span className="text-green-500 text-sm block mb-1">الباقي للعميل:</span>
                        <span className="text-green-500 text-2xl font-bold font-mono">{formatCurrency(amountPaid - total)}</span>
                      </div>
                    ) : error ? (
                      <motion.p 
                        initial={{ x: -10 }}
                        animate={{ x: [0, -10, 10, -10, 10, 0] }}
                        className="text-red-500 text-center font-bold"
                      >
                        {error}
                      </motion.p>
                    ) : null}
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center">
                    <p className="text-amber-500 font-bold text-lg">
                      سيتم تسجيل الطلب بقيمة {formatCurrency(total)}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white text-center">الفاتورة جاهزة</h2>
                
                <div className="flex justify-center">
                  <ReceiptPreview 
                    order={{
                      id: 'preview',
                      orderNumber: (useOrdersStore.getState().lastOrderNumber + 1).toString(),
                      items: items.map(item => ({
                        productId: item.product.id,
                        productName: item.product.name,
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                        total: item.product.price * item.quantity
                      })),
                      subtotal,
                      discount: discountAmount,
                      discountType,
                      total,
                      paymentMethod: selectedMethod as any,
                      amountPaid: selectedMethod === 'cash' ? amountPaid : total,
                      change: selectedMethod === 'cash' ? Math.max(0, amountPaid - total) : 0,
                      cashierId: currentUser?.id || '',
                      cashierName: currentUser?.name || '',
                      tableNumber: tableNumber || undefined,
                      orderType,
                      deliveryFees,
                      status: 'preparing',
                      createdAt: new Date()
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-white/10 bg-[#1a1d2e] sticky bottom-0 z-10">
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={() => setStep((currentStep - 1) as 1 | 2 | 3)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                رجوع
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={handleNextStep}
                className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                التالي: الفاتورة
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentStep === 3 && (
              <>
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  طباعة
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
                >
                  <Check className="w-6 h-6" />
                  تأكيد وإغلاق
                </button>
              </>
            )}
          </div>
        </div>

        {/* Close Confirmation Overlay */}
        <AnimatePresence>
          {showCloseConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <div className="bg-[#1a1d2e] p-8 rounded-2xl border border-white/10 text-center space-y-6 max-w-xs w-full">
                <h3 className="text-xl font-bold text-white">هل تريد إلغاء الطلب؟</h3>
                <p className="text-white/60 text-sm">سيتم إغلاق النافذة ولكن سيبقى الطلب في السلة.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCloseConfirm(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={confirmClose}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    نعم، إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentModal; // ✅ NEW
