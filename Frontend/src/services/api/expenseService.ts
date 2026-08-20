import { apiClient } from './client';
import {
  CreateExpenseRequest,
  ExpenseListResponse,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '../../types/api';
import { Expense } from '../../types/models';

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const res = await apiClient.get<ExpenseListResponse>('/api/expenses');
    return res.data.data;
  },

  async getExpenseById(id: string): Promise<Expense> {
    const res = await apiClient.get<ExpenseResponse>(`/api/expenses/${id}`);
    return res.data.data;
  },

  async createExpense(payload: CreateExpenseRequest): Promise<Expense> {
    const res = await apiClient.post<ExpenseResponse>(
      '/api/expenses',
      payload,
    );
    return res.data.data;
  },

  async updateExpense(
    id: string,
    payload: UpdateExpenseRequest,
  ): Promise<Expense> {
    const res = await apiClient.put<ExpenseResponse>(
      `/api/expenses/${id}`,
      payload,
    );
    return res.data.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(`/api/expenses/${id}`);
  },
};
