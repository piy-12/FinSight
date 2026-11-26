from datetime import date
from decimal import Decimal

from app.services.backend_client import backend_client
from app.schemas.financial import (
    ExpenseItem,
    UserFinancialProfile,
    CategorySummary,
    MonthlyTrendItem,
    FinancialSummary,
    FinancialContext,
    CompleteFinancialContext,
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
            monthlyIncome=Decimal(str(profile_data["monthlyIncome"])),
            savingsGoal=Decimal(str(profile_data["savingsGoal"])),
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
        spending_budget = profile.monthlyIncome - profile.savingsGoal
        remaining_budget = spending_budget - total_spent

        # Category breakdown
        category_totals: dict[str, Decimal] = {}
        category_counts: dict[str, int] = {}

        for expense in current_month_expenses:
            category = expense.category
            category_totals[category] = (
                category_totals.get(category, Decimal("0")) + expense.amount
            )
            category_counts[category] = category_counts.get(category, 0) + 1

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

    async def get_complete_financial_context(
        self,
        access_token: str
    ) -> CompleteFinancialContext:
        """
        Fetches the user's profile and ALL historical expenses from the backend,
        computing both all-time analytics and current-month budget status.
        """
        profile_response = await backend_client.get("/api/profile", access_token)
        expense_response = await backend_client.get("/api/expenses", access_token)

        profile_data = profile_response["profile"]
        expenses_data = expense_response["data"]

        profile = UserFinancialProfile(
            monthlyIncome=Decimal(str(profile_data["monthlyIncome"])),
            savingsGoal=Decimal(str(profile_data["savingsGoal"])),
            currency=profile_data["currency"]
        )

        all_expenses = sorted(
            [ExpenseItem(**expense) for expense in expenses_data],
            key=lambda e: e.expenseDate,
            reverse=True
        )

        # Current month calculations
        today = date.today()
        current_month_expenses = [
            e for e in all_expenses
            if e.expenseDate.year == today.year and e.expenseDate.month == today.month
        ]
        current_month_spent = sum(
            (e.amount for e in current_month_expenses),
            Decimal("0")
        )
        monthly_spending_budget = profile.monthlyIncome - profile.savingsGoal
        current_month_remaining = monthly_spending_budget - current_month_spent

        # All-time totals & category breakdown
        total_all_time_spent = sum(
            (e.amount for e in all_expenses),
            Decimal("0")
        )

        category_totals: dict[str, Decimal] = {}
        category_counts: dict[str, int] = {}
        monthly_totals: dict[str, Decimal] = {}
        monthly_counts: dict[str, int] = {}

        for expense in all_expenses:
            cat = expense.category
            category_totals[cat] = category_totals.get(cat, Decimal("0")) + expense.amount
            category_counts[cat] = category_counts.get(cat, 0) + 1

            month_key = expense.expenseDate.strftime("%Y-%m")
            monthly_totals[month_key] = monthly_totals.get(month_key, Decimal("0")) + expense.amount
            monthly_counts[month_key] = monthly_counts.get(month_key, 0) + 1

        all_time_categories = sorted(
            [
                CategorySummary(
                    category=cat,
                    totalAmount=amount,
                    transactionCount=category_counts[cat]
                )
                for cat, amount in category_totals.items()
            ],
            key=lambda item: item.totalAmount,
            reverse=True
        )

        monthly_trend = [
            MonthlyTrendItem(
                month=m_key,
                totalSpent=monthly_totals[m_key],
                transactionCount=monthly_counts[m_key]
            )
            for m_key in sorted(monthly_totals.keys(), reverse=True)
        ]

        active_months = max(len(monthly_trend), 1)
        avg_monthly_spend = (total_all_time_spent / Decimal(active_months)).quantize(Decimal("0.01"))

        all_time_top_category = (
            all_time_categories[0].category if all_time_categories else None
        )

        return CompleteFinancialContext(
            profile=profile,
            monthlySpendingBudget=monthly_spending_budget,
            currentMonthSpent=current_month_spent,
            currentMonthRemainingBudget=current_month_remaining,
            totalAllTimeSpent=total_all_time_spent,
            totalAllTimeTransactions=len(all_expenses),
            averageMonthlySpend=avg_monthly_spend,
            allTimeTopCategory=all_time_top_category,
            allTimeCategoryBreakdown=all_time_categories,
            monthlyTrend=monthly_trend,
            allExpenses=all_expenses
        )


financial_data_service = FinancialDataService()