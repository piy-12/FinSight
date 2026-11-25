from pydantic import BaseModel
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