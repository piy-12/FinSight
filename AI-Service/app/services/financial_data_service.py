from datetime import date
from decimal import Decimal

from app.services.backend_client import backend_client
from app.schemas.financial import (
    ExpenseItem,
    UserFinancialProfile,
    CategorySummary,
    FinancialSummary,
    FinancialContext
)


class FinancialDataService:

    async def get_financial_context(
        self,
        access_token: str
    ) -> FinancialContext:

        # Fetch user profile
        profile_response = await backend_client.get(
            "/api/profile",
            access_token
        )

        # Fetch user expenses
        expense_response = await backend_client.get(
            "/api/expenses",
            access_token
        )

        profile_data = profile_response["profile"]

        expenses_data = expense_response["data"]

        # Convert profile
        profile = UserFinancialProfile(
            monthlyIncome=Decimal(
                str(profile_data["monthlyIncome"])
            ),

            savingsGoal=Decimal(
                str(profile_data["savingsGoal"])
            ),

            currency=profile_data["currency"]
        )

        # Convert expenses
        expenses = [
            ExpenseItem(**expense)
            for expense in expenses_data
        ]

        # Current month expenses
        today = date.today()

        current_month_expenses = [
            expense
            for expense in expenses
            if (
                expense.expenseDate.year == today.year
                and expense.expenseDate.month == today.month
            )
        ]

        # Financial calculations
        total_spent = sum(
            (expense.amount for expense in current_month_expenses),
            Decimal("0")
        )

        spending_budget = (
            profile.monthlyIncome - profile.savingsGoal
        )

        remaining_budget = (
            spending_budget - total_spent
        )

        # Category breakdown
        category_totals = {}

        category_counts = {}

        for expense in current_month_expenses:

            category = expense.category

            category_totals[category] = (
                category_totals.get(
                    category,
                    Decimal("0")
                ) + expense.amount
            )

            category_counts[category] = (
                category_counts.get(category, 0) + 1
            )

        category_breakdown = [
            CategorySummary(
                category=category,
                totalAmount=amount,
                transactionCount=category_counts[category]
            )
            for category, amount in category_totals.items()
        ]

        category_breakdown.sort(
            key=lambda item: item.totalAmount,
            reverse=True
        )

        top_category = (
            category_breakdown[0].category
            if category_breakdown
            else None
        )

        # Summary
        summary = FinancialSummary(

            monthlyIncome=profile.monthlyIncome,

            savingsGoal=profile.savingsGoal,

            spendingBudget=spending_budget,

            totalSpent=total_spent,

            remainingBudget=remaining_budget,

            totalExpenses=len(current_month_expenses),

            topCategory=top_category,

            categoryBreakdown=category_breakdown

        )

        # Recent expenses
        recent_expenses = sorted(
            expenses,
            key=lambda expense: expense.expenseDate,
            reverse=True
        )[:5]

        return FinancialContext(

            profile=profile,

            summary=summary,

            recentExpenses=recent_expenses

        )


financial_data_service = FinancialDataService()