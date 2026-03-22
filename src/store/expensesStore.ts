import { create } from 'zustand';
import { Expense } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_EXPENSES } from '../lib/mockData';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

interface ExpensesState {
  expenses: Expense[];
  
  /**
   * Adds a new expense and persists it
   * @param expense Expense data
   */
  addExpense: (expense: Expense) => void;
  
  /**
   * Deletes an expense
   * @param expenseId ID of the expense to delete
   */
  deleteExpense: (expenseId: string) => void;
  
  /**
   * Returns total expenses within a specific date range
   * @param start Start date
   * @param end End date
   */
  getTotalByDateRange: (start: Date, end: Date) => number;
  
  /**
   * Returns expenses grouped by category with totals
   * @returns Object with category totals
   */
  getByCategory: () => Record<string, number>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
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

  getTotalByDateRange: (start, end) => {
    // ✅ LOGIC FIX: Correct date filtering
    const interval = { start: startOfDay(start), end: endOfDay(end) };
    return get().expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, interval);
      })
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getByCategory: () => {
    // ✅ LOGIC FIX: Groups expenses by category with totals
    return get().expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}));
