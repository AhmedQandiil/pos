import React from 'react'; // ✅ NEW
import { Order } from '../../types'; // ✅ NEW
import { formatCurrency, formatDateTime } from '../../lib/formatters'; // ✅ NEW
import { APP_NAME, PAYMENT_METHOD_LABELS } from '../../lib/constants'; // ✅ NEW
import { QRCodeSVG } from 'qrcode.react'; // ✅ NEW
import { useSettingsStore } from '../../store/settingsStore'; // ✅ NEW

interface ReceiptPreviewProps { // ✅ NEW
  order: Order;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ order }) => { // ✅ NEW
  const { settings } = useSettingsStore();
  
  const footerText = settings.receiptFooter || 'شكراً لزيارتكم 🙏';
  const qrContent = settings.qrCodeContent || `${settings.restaurantName} - Order #${order.orderNumber}`;

  return (
    <div id="receipt-content" className="bg-[#fdfbf7] text-black p-6 shadow-lg max-w-[350px] mx-auto font-sans border border-gray-200"> {/* ✅ NEW */}
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
          POS
        </div>
        <h2 className="text-xl font-bold">{settings.restaurantName}</h2>
        <p className="text-sm text-gray-500">{settings.address}</p>
        <p className="text-sm text-gray-500">ت: {settings.phoneNumber}</p>
      </div>

      {/* Order Info */}
      <div className="border-y border-dashed border-gray-300 py-3 mb-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>رقم الفاتورة:</span>
          <span className="font-bold">#{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ:</span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>الكاشير:</span>
          <span>{order.cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>نوع الطلب:</span>
          <span className="font-bold">
            {order.orderType === 'dine_in' ? `طاولة ${order.tableNumber}` : order.orderType === 'takeaway' ? 'تيك أواي' : 'دليفري'}
          </span>
        </div>
      </div>

      {/* Items */}
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
              <td className="py-2 text-left font-mono">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="space-y-1 text-sm mb-6">
        <div className="flex justify-between">
          <span>الإجمالي الفرعي:</span>
          <span className="font-mono">{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>الخصم:</span>
            <span className="font-mono">-{formatCurrency(order.discount)}</span>
          </div>
        )}
        {order.deliveryFees > 0 && (
          <div className="flex justify-between">
            <span>رسوم التوصيل:</span>
            <span className="font-mono">{formatCurrency(order.deliveryFees)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>الإجمالي النهائي:</span>
          <span className="font-mono">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="border-t border-dashed border-gray-300 pt-4 text-center">
        <p className="text-sm font-bold mb-1">طريقة الدفع: {PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
        {order.paymentMethod === 'cash' && (
          <div className="text-xs text-gray-500 space-y-1 mb-4">
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
};
