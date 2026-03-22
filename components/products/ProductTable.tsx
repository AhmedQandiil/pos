'use client';

import React from 'react';
import { Product } from '../../types';
import { useProductsStore } from '../../store/productsStore';
import { formatCurrency } from '../../lib/formatters';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onEdit }: ProductTableProps) {
  const { deleteProduct, categories } = useProductsStore();

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'غير معروف';
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      toast.success('تم حذف المنتج بنجاح');
    }
  };

  return (
    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="text-slate-400 text-sm border-b border-white/5">
              <th className="p-4 font-bold">المنتج</th>
              <th className="p-4 font-bold">التصنيف</th>
              <th className="p-4 font-bold">السعر</th>
              <th className="p-4 font-bold">الحالة</th>
              <th className="p-4 font-bold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{p.nameEn}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold">
                    {getCategoryName(p.categoryId)}
                  </span>
                </td>
                <td className="p-4 font-space-mono font-bold text-[#f59e0b]">
                  {formatCurrency(p.price)}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    p.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {p.isAvailable ? 'متاح' : 'غير متاح'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(p)}
                      className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 hover:bg-white/5 rounded-lg text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
