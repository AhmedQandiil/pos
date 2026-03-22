'use client';

import React, { useState, useMemo } from 'react';
import { useExpensesStore } from '../../store/expensesStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { EXPENSE_CATEGORY_LABELS } from '../../lib/constants';
import { Plus, Search, Wallet, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateId } from '../../lib/utils';
import { Expense } from '../../types';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import { isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns';
import ExpenseForm from '../../components/expenses/ExpenseForm';

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useExpensesStore();
  const { currentUser } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(subDays(new Date(), 30)),
    end: endOfDay(new Date()),
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchesDate = isWithinInterval(new Date(e.date), { start: dateRange.start, end: dateRange.end });
      return matchesSearch && matchesDate;
    });
  }, [expenses, search, dateRange]);

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
        <h1 className="text-2xl md:text-3xl font-bold">إدارة المصاريف</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex-1 sm:flex-none">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all min-h-[48px]"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مصروف جديد</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-right">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-400 text-[10px] md:text-sm font-bold truncate">إجمالي المصاريف</p>
            <p className="text-lg md:text-2xl font-bold font-space-mono truncate">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-right">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-400 text-[10px] md:text-sm font-bold truncate">عدد العمليات</p>
            <p className="text-lg md:text-2xl font-bold font-space-mono truncate">{filteredExpenses.length}</p>
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
          className="w-full bg-[#1a1d26] border border-white/5 rounded-xl py-4 pr-12 pl-4 focus:outline-none focus:border-rose-500/50 transition-all min-h-[48px] text-lg"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
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
                      className="p-3 hover:bg-white/5 rounded-xl text-red-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredExpenses.map((e) => (
          <div key={e.id} className="bg-[#1a1d26] border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg truncate">{e.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{EXPENSE_CATEGORY_LABELS[e.category]}</p>
              </div>
              <div className="text-left">
                <p className="font-space-mono font-bold text-rose-400 text-lg">{formatCurrency(e.amount)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{formatDate(e.date)}</p>
              </div>
            </div>
            
            {e.notes && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 leading-relaxed">{e.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => handleDelete(e.id)}
                className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all min-h-[44px]"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-bold">حذف</span>
              </button>
            </div>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12 bg-[#1a1d26] rounded-2xl border border-white/5">
            <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-400">لا توجد مصاريف مطابقة للبحث</p>
          </div>
        )}
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
