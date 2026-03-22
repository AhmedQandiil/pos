'use client';

import React, { useState } from 'react';
import { useProductsStore } from '../../store/productsStore';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateId } from '../../lib/utils';

interface CategoryModalProps {
  onClose: () => void;
}

export default function CategoryModal({ onClose }: CategoryModalProps) {
  const { addCategory } = useProductsStore();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم التصنيف');
      return;
    }

    addCategory({
      id: generateId(),
      name: name.trim(),
    });

    toast.success('تم إضافة التصنيف بنجاح');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1d26] w-full max-w-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">إضافة تصنيف جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">اسم التصنيف *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
              placeholder="مثال: مشروبات باردة"
              required
              autoFocus
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-4 rounded-xl transition-all"
            >
              <Save className="w-5 h-5" />
              <span>حفظ التصنيف</span>
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
