'use client';

import React, { useState } from 'react';
import { Product } from '../../types';
import { useProductsStore } from '../../store/productsStore';
import { X, Save, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateId } from '../../lib/utils';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { addProduct, updateProduct, categories, addCategory } = useProductsStore();
  
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      nameEn: '',
      price: 0,
      categoryId: categories[0]?.id || '',
      isAvailable: true,
      description: '',
      imageUrl: '',
    }
  );

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }

    if (product) {
      updateProduct({ ...product, ...formData } as Product);
      toast.success('تم تحديث المنتج بنجاح');
    } else {
      addProduct({
        ...formData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      } as Product);
      toast.success('تم إضافة المنتج بنجاح');
    }
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const id = generateId();
    addCategory({ id, name: newCategoryName });
    setFormData({ ...formData, categoryId: id });
    setNewCategoryName('');
    setShowAddCategory(false);
    toast.success('تم إضافة التصنيف بنجاح');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1d26] w-full max-w-xl rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">الاسم بالعربي *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">الاسم بالإنجليزي</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">السعر *</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b] font-space-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">التصنيف *</label>
              <div className="flex gap-2">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex-1 bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showAddCategory && (
            <div className="flex gap-2 bg-white/5 p-3 rounded-xl border border-[#f59e0b]/20">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="اسم التصنيف الجديد..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-[#f59e0b] text-black px-4 py-1 rounded-lg text-sm font-bold"
              >
                إضافة
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="text-slate-400"
              >
                إلغاء
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">رابط الصورة (URL)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-[#0f1117] text-[#f59e0b] focus:ring-[#f59e0b]"
            />
            <label htmlFor="isAvailable" className="font-bold">متاح للطلب</label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-4 rounded-xl transition-all"
            >
              <Save className="w-5 h-5" />
              <span>حفظ المنتج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 font-bold py-4 rounded-xl transition-all border border-white/5"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
