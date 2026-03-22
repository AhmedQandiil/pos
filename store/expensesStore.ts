import { create } from 'zustand';
import { Expense } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_EXPENSES } from '../lib/mockData';

interface ExpensesState {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: storage.get<Expense[]>('pos_expenses', MOCK_EXPENSES),

  addExpense: (expense) => {
    set((state) => {
      const newExpenses = [expense, ...state.expenses];
      storage.set('pos_expenses', newExpenses);
      return { expenses: newExpenses };
    });
  },

  deleteExpense: (expenseId) => {
    set((state) => {
      const newExpenses = state.expenses.filter((e) => e.id !== expenseId);
      storage.set('pos_expenses', newExpenses);
      return { expenses: newExpenses };
    });
  },
}));
