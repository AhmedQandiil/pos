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
  const { deleteProduct, updateProduct, categories } = useProductsStore(); // ✅ BUG FIX: added updateProduct

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'غير معروف';
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) { // ✅ BUG FIX: confirmation dialog
      deleteProduct(id);
      toast.success('تم حذف المنتج بنجاح');
    }
  };

  const toggleAvailability = (product: Product) => { // ✅ BUG FIX: availability toggle
    const updatedProduct = { ...product, isAvailable: !product.isAvailable };
    updateProduct(updatedProduct); // ✅ BUG FIX: updates store + localStorage immediately
    toast.success(updatedProduct.isAvailable ? 'المنتج متاح الآن' : 'المنتج غير متاح الآن');
  };

  return (
    <div className="space-y-4"> {/* ✅ RESPONSIVE FIX */}
      {/* Mobile: Card List Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden"> {/* ✅ RESPONSIVE FIX */}
        {products.map((p) => (
          <div key={p.id} className="bg-[#1a1d26] border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg"> {/* ✅ RESPONSIVE FIX */}
            <div className="flex items-center gap-4"> {/* ✅ RESPONSIVE FIX */}
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden shrink-0"> {/* ✅ RESPONSIVE FIX */}
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0"> {/* ✅ RESPONSIVE FIX */}
                <p className="font-bold text-lg truncate">{p.name}</p> {/* ✅ RESPONSIVE FIX */}
                <p className="text-sm text-slate-500 font-mono truncate">{p.nameEn}</p> {/* ✅ RESPONSIVE FIX */}
                <span className="inline-block px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold mt-1">
                  {getCategoryName(p.categoryId)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4"> {/* ✅ RESPONSIVE FIX */}
              <div className="font-space-mono font-bold text-[#f59e0b] text-xl">
                {formatCurrency(p.price)}
              </div>
              <div className="flex items-center gap-2"> {/* ✅ RESPONSIVE FIX */}
                <button
                  onClick={() => toggleAvailability(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] min-w-[80px] ${
                    p.isAvailable ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}
                >
                  {p.isAvailable ? 'متاح' : 'غير متاح'}
                </button>
                <button 
                  onClick={() => onEdit(p)}
                  className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center" // ✅ RESPONSIVE FIX
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center" // ✅ RESPONSIVE FIX
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Full Table Layout */}
      <div className="hidden md:block bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg"> {/* ✅ RESPONSIVE FIX */}
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
                    <button
                      onClick={() => toggleAvailability(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        p.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {p.isAvailable ? 'متاح' : 'غير متاح'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(p)}
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center" // ✅ RESPONSIVE FIX
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-red-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center" // ✅ RESPONSIVE FIX
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
    </div>
  );
}
