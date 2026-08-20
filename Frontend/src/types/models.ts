/**
 * Types mirrored directly from the FinSight backend (Prisma models + controllers).
 * Do not add fields that don't exist on the backend response shapes.
 */

export type ExpenseCategory =
  | 'FOOD'
  | 'RENT'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'LIFESTYLE'
  | 'HEALTH'
  | 'EDUCATION'
  | 'UTILITIES'
  | 'TRAVEL'
  | 'DATING'
  | 'OTHER';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'FOOD',
  'RENT',
  'TRANSPORT',
  'SHOPPING',
  'ENTERTAINMENT',
  'LIFESTYLE',
  'HEALTH',
  'EDUCATION',
  'UTILITIES',
  'TRAVEL',
  'DATING',
  'OTHER',
];

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  id: string;
  monthlyIncome: number;
  savingsGoal: number;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  /** Only present on GET /api/profile — computed server-side. */
  spendingBudget?: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  notes: string | null;
  expenseDate: string;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DashboardData {
  monthlyIncome: number;
  savingsGoal: number;
  spendingBudget: number;
  totalSpent: number;
  remainingBudget: number;
  totalExpenses: number;
  topCategory: string;
  categoryBreakdown: Record<string, number>;
  recentExpenses: Expense[];
}
