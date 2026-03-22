'use client';

import React, { useState, useMemo } from 'react';
import { useExpensesStore } from '../../store/expensesStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { EXPENSE_CATEGORY_LABELS } from '../../lib/constants';
import { Plus, Search, Wallet, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateId } from '../../lib/utils';
import { Expense, ExpenseCategory } from '../../types';

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useExpensesStore();
  const { currentUser } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => 
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [expenses, search]);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      deleteExpense(id);
      toast.success('تم حذف المصروف');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">إدارة المصاريف</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مصروف جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold">إجمالي المصاريف</p>
            <p className="text-2xl font-bold font-space-mono">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold">عدد العمليات</p>
            <p className="text-2xl font-bold font-space-mono">{filteredExpenses.length}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث عن مصروف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a1d26] border border-white/5 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-rose-500/50 transition-all"
        />
      </div>

      <div className="bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-white/5">
                <th className="p-4 font-bold">المصروف</th>
                <th className="p-4 font-bold">التصنيف</th>
                <th className="p-4 font-bold">المبلغ</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-bold">{e.name}</p>
                      {e.notes && <p className="text-xs text-slate-500 mt-1">{e.notes}</p>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold">
                      {EXPENSE_CATEGORY_LABELS[e.category]}
                    </span>
                  </td>
                  <td className="p-4 font-space-mono font-bold text-rose-400">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {formatDate(e.date)}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(e.id)}
                      className="p-2 hover:bg-white/5 rounded-lg text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ExpenseForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={(data) => {
            addExpense({
              ...data,
              id: generateId(),
              createdBy: currentUser?.id || '',
            });
            setIsFormOpen(false);
            toast.success('تم إضافة المصروف بنجاح');
          }}
        />
      )}
    </div>
  );
}

function ExpenseForm({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: 'other' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1d26] w-full max-w-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">إضافة مصروف جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">اسم المصروف *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">المبلغ *</label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500 font-space-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-bold">التصنيف *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                required
              >
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">التاريخ *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500 h-24 resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all"
            >
              حفظ المصروف
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
