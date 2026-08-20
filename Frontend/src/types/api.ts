import { Expense, User, UserProfile } from './models';

/** Generic shape used by most FinSight endpoints. */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

// ---- Auth ----
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

// ---- Profile ----
// NOTE: profile endpoints respond with `profile`, not `data` — matches
// controllers/profile.controller.ts exactly.
export interface ProfileResponse {
  success: boolean;
  message?: string;
  profile: UserProfile;
}

export interface ProfileRequest {
  monthlyIncome: number;
  savingsGoal: number;
}

// ---- Expenses ----
export interface CreateExpenseRequest {
  amount: number;
  category: string;
  notes?: string;
  expenseDate: string;
  receiptUrl?: string;
}

export type UpdateExpenseRequest = Partial<CreateExpenseRequest>;

export type ExpenseResponse = ApiSuccess<Expense>;
export type ExpenseListResponse = ApiSuccess<Expense[]>;
