'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORY_LABELS } from '../../lib/constants';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ExpenseForm({ onClose, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: 'other' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0], // ✅ BUG FIX: date defaults to today
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // ✅ BUG FIX: inline error messages

  const validate = () => { // ✅ BUG FIX: form validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'اسم المصروف مطلوب';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'المبلغ يجب أن يكون أكبر من 0'; // ✅ BUG FIX: amount cannot be 0 or negative
    if (!formData.category) newErrors.category = 'التصنيف مطلوب';
    if (!formData.date) newErrors.date = 'التاريخ مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center md:p-4 backdrop-blur-sm"> {/* ✅ RESPONSIVE FIX: same modal behavior as ProductForm */}
      <div className="bg-[#1a1d26] w-full h-full md:h-auto md:max-w-md md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col"> {/* ✅ RESPONSIVE FIX: full screen on mobile */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">إضافة مصروف جديد</h2>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-xl transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"> {/* ✅ RESPONSIVE FIX */}
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6"> {/* ✅ RESPONSIVE FIX: scrollable form */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">اسم المصروف *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-[#0f1117] border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-rose-500 min-h-[48px] text-lg`} // ✅ RESPONSIVE FIX
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>} {/* ✅ BUG FIX */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* ✅ RESPONSIVE FIX */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">المبلغ *</label>
              <input
                type="number"
                min="0" // ✅ BUG FIX
                inputMode="decimal" // ✅ RESPONSIVE FIX
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`w-full bg-[#0f1117] border ${errors.amount ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-rose-500 font-space-mono min-h-[48px] text-lg`} // ✅ RESPONSIVE FIX
                required
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>} {/* ✅ BUG FIX */}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">التصنيف *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className={`w-full bg-[#0f1117] border ${errors.category ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-rose-500 min-h-[48px] text-lg appearance-none`} // ✅ RESPONSIVE FIX
                required
              >
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>} {/* ✅ BUG FIX */}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">التاريخ *</label>
            <input
              type="date" // ✅ RESPONSIVE FIX: native date input
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full bg-[#0f1117] border ${errors.date ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 focus:outline-none focus:border-rose-500 min-h-[48px] text-lg`} // ✅ RESPONSIVE FIX
              required
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>} {/* ✅ BUG FIX */}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-rose-500 h-32 resize-none text-lg" // ✅ RESPONSIVE FIX: min 3 rows (h-32)
              placeholder="أضف ملاحظاتك هنا..."
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 shrink-0"> {/* ✅ RESPONSIVE FIX */}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all text-lg min-h-[56px]" // ✅ RESPONSIVE FIX
            >
              <Save className="w-6 h-6" />
              <span>حفظ المصروف</span>
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
