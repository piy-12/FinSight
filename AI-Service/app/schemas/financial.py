from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional


class ExpenseItem(BaseModel):

    id: str

    amount: Decimal

    category: str

    notes: Optional[str] = None

    expenseDate: datetime


class UserFinancialProfile(BaseModel):

    monthlyIncome: Decimal

    savingsGoal: Decimal

    currency: str


class CategorySummary(BaseModel):

    category: str

    totalAmount: Decimal

    transactionCount: int


class MonthlyTrendItem(BaseModel):

    month: str  # e.g., "2026-11"

    totalSpent: Decimal

    transactionCount: int


class FinancialSummary(BaseModel):

    monthlyIncome: Decimal

    savingsGoal: Decimal

    spendingBudget: Decimal

    totalSpent: Decimal

    remainingBudget: Decimal

    totalExpenses: int

    topCategory: Optional[str]

    categoryBreakdown: list[CategorySummary]


class FinancialContext(BaseModel):

    profile: UserFinancialProfile

    summary: FinancialSummary

    recentExpenses: list[ExpenseItem]


class CompleteFinancialContext(BaseModel):

    profile: UserFinancialProfile

    # Current month budget tracking
    monthlySpendingBudget: Decimal

    currentMonthSpent: Decimal

    currentMonthRemainingBudget: Decimal

    # All-time complete metrics
    totalAllTimeSpent: Decimal

    totalAllTimeTransactions: int

    averageMonthlySpend: Decimal

    allTimeTopCategory: Optional[str]

    allTimeCategoryBreakdown: list[CategorySummary]

    monthlyTrend: list[MonthlyTrendItem]

    allExpenses: list[ExpenseItem]


class ChatRequest(BaseModel):

    message: str = Field(..., min_length=1)

    thread_id: Optional[str] = None


class ChatResponse(BaseModel):

    success: bool = True

    reply: str

    thread_id: str