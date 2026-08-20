import { useCallback, useEffect, useState } from 'react';
import { expenseService } from '../services/api/expenseService';
import { Expense } from '../types/models';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../types/api';
import { parseApiError } from '../services/api/client';

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createExpense: (payload: CreateExpenseRequest) => Promise<Expense>;
  updateExpense: (
    id: string,
    payload: UpdateExpenseRequest,
  ) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
}

export function useExpenses(autoFetch = true): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const result = await expenseService.getExpenses();
      // Most recent first.
      result.sort(
        (a, b) =>
          new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime(),
      );
      setExpenses(result);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createExpense = async (payload: CreateExpenseRequest) => {
    const created = await expenseService.createExpense(payload);
    setExpenses(prev =>
      [created, ...prev].sort(
        (a, b) =>
          new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime(),
      ),
    );
    return created;
  };

  const updateExpense = async (id: string, payload: UpdateExpenseRequest) => {
    const updated = await expenseService.updateExpense(id, payload);
    setExpenses(prev => prev.map(e => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteExpense = async (id: string) => {
    await expenseService.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return {
    expenses,
    loading,
    refreshing,
    error,
    refresh: () => fetchExpenses(true),
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
