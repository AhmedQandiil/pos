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

  const [errors, setErrors] = useState<Record<string, string>>({}); // ✅ BUG FIX: inline error messages
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const validate = () => { // ✅ BUG FIX: form validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'الاسم بالعربي مطلوب';
    if (!formData.price || formData.price <= 0) newErrors.price = 'السعر يجب أن يكون أكبر من 0';
    if (!formData.categoryId) newErrors.categoryId = 'التصنيف مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // ✅ BUG FIX: validate before submit

    if (product) {
      updateProduct({ ...product, ...formData } as Product);
      toast.success('تم تحديث المنتج بنجاح');
    } else {
      addProduct({
        ...formData,
        id: generateId(),
        createdAt: new Date(),
      } as Product);
      toast.success('تم إضافة المنتج بنجاح');
    }
    
    // ✅ RESPONSIVE FIX: Form resets after successful submit
    setFormData({
      name: '',
      nameEn: '',
      price: 0,
      categoryId: categories[0]?.id || '',
      isAvailable: true,
      description: '',
      imageUrl: '',
    });
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
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center md:p-4 backdrop-blur-sm"> {/* ✅ RESPONSIVE FIX: z-index and padding */}
      <div className="bg-[#1a1d26] w-full h-full md:h-auto md:max-w-xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col"> {/* ✅ RESPONSIVE FIX: full screen on mobile */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-xl transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"> {/* ✅ RESPONSIVE FIX */}
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6"> {/* ✅ RESPONSIVE FIX: scrollable form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* ✅ RESPONSIVE FIX */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">الاسم بالعربي *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-[#0f1117] border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-[#f59e0b] min-h-[48px] text-lg`} // ✅ RESPONSIVE FIX
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>} {/* ✅ BUG FIX */}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">الاسم بالإنجليزي</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#f59e0b] font-mono min-h-[48px] text-lg" // ✅ RESPONSIVE FIX
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* ✅ RESPONSIVE FIX */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">السعر *</label>
              <input
                type="number"
                min="0" // ✅ RESPONSIVE FIX
                inputMode="decimal" // ✅ RESPONSIVE FIX
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`w-full bg-[#0f1117] border ${errors.price ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-[#f59e0b] font-space-mono min-h-[48px] text-lg`} // ✅ RESPONSIVE FIX
                required
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>} {/* ✅ BUG FIX */}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">التصنيف *</label>
              <div className="flex gap-2">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className={`flex-1 bg-[#0f1117] border ${errors.categoryId ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-[#f59e0b] min-h-[48px] text-lg appearance-none`} // ✅ RESPONSIVE FIX
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 min-h-[48px] min-w-[48px] flex items-center justify-center" // ✅ RESPONSIVE FIX
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>} {/* ✅ BUG FIX */}
            </div>
          </div>

          {showAddCategory && (
            <div className="flex flex-col sm:flex-row gap-2 bg-white/5 p-4 rounded-xl border border-[#f59e0b]/20"> {/* ✅ RESPONSIVE FIX */}
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="اسم التصنيف الجديد..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg min-h-[48px]" // ✅ RESPONSIVE FIX
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="flex-1 sm:flex-none bg-[#f59e0b] text-black px-6 py-2 rounded-lg text-sm font-bold min-h-[44px]" // ✅ RESPONSIVE FIX
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 sm:flex-none text-slate-400 px-4 py-2 hover:bg-white/5 rounded-lg min-h-[44px]" // ✅ RESPONSIVE FIX
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4"> {/* ✅ RESPONSIVE FIX */}
            <label className="text-sm text-slate-400 font-bold">صورة المنتج</label>
            <div className="flex flex-col gap-6"> {/* ✅ RESPONSIVE FIX */}
              {formData.imageUrl && (
                <div className="relative w-full aspect-video md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 mx-auto md:mx-0"> {/* ✅ RESPONSIVE FIX: preview */}
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg" // ✅ RESPONSIVE FIX
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-4"> {/* ✅ RESPONSIVE FIX */}
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, imageUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-4 text-sm text-slate-400 flex items-center justify-center gap-2 hover:border-[#f59e0b]/50 transition-all min-h-[48px]"> {/* ✅ RESPONSIVE FIX */}
                    <span>اختر صورة من الجهاز...</span>
                  </div>
                </div>
                <div className="w-full">
                  <input
                    type="url"
                    placeholder="أو ضع رابط الصورة هنا..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#f59e0b] text-lg min-h-[48px]" // ✅ RESPONSIVE FIX
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-y border-white/5"> {/* ✅ RESPONSIVE FIX */}
            <label htmlFor="isAvailable" className="font-bold text-lg">متاح للطلب</label> {/* ✅ RESPONSIVE FIX */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                formData.isAvailable ? 'bg-emerald-500' : 'bg-slate-700'
              }`} // ✅ RESPONSIVE FIX: switch component
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.isAvailable ? '-translate-x-7' : '-translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 shrink-0"> {/* ✅ RESPONSIVE FIX */}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-5 rounded-2xl transition-all text-lg min-h-[56px]" // ✅ RESPONSIVE FIX
            >
              <Save className="w-6 h-6" />
              <span>حفظ المنتج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 font-bold py-5 rounded-2xl transition-all border border-white/5 text-lg min-h-[56px]" // ✅ RESPONSIVE FIX
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
