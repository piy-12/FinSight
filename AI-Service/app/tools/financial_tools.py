from decimal import Decimal
from typing import Optional

from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

from app.schemas.financial import ExpenseItem
from app.services.backend_client import backend_client
from app.services.financial_data_service import financial_data_service

VALID_CATEGORIES = {
    "FOOD", "RENT", "TRANSPORT", "SHOPPING", "ENTERTAINMENT",
    "LIFESTYLE", "HEALTH", "EDUCATION", "UTILITIES", "TRAVEL",
    "DATING", "OTHER",
}

DISCRETIONARY_CATEGORIES = {
    "FOOD", "SHOPPING", "ENTERTAINMENT", "LIFESTYLE", "TRAVEL", "DATING",
}


def _extract_token(config: RunnableConfig) -> str:
    token = config.get("configurable", {}).get("access_token")
    if not token:
        raise ValueError("Missing user access_token in runnable config.")
    return token


@tool
async def get_complete_financial_overview(config: RunnableConfig) -> dict:
    """
    Fetch the user's complete financial picture: profile, monthly income, savings goal,
    all-time total spent, average monthly spend, month-by-month spending history,
    all-time category breakdown, and current month budget status.
    """
    token = _extract_token(config)
    context = await financial_data_service.get_complete_financial_context(token)
    data = context.model_dump(mode="json")
    # Summary overview without duplicating the entire raw list unless queried via search_expenses
    data.pop("allExpenses", None)
    return data


@tool
async def search_user_expenses(
    config: RunnableConfig,
    category: Optional[str] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    min_amount: Optional[float] = None,
    keyword: Optional[str] = None,
) -> dict:
    """
    Query and filter across ALL historical user expenses by category, month (1-12),
    year (e.g. 2026), minimum amount, or keyword in notes.
    Valid categories: FOOD, RENT, TRANSPORT, SHOPPING, ENTERTAINMENT, LIFESTYLE,
    HEALTH, EDUCATION, UTILITIES, TRAVEL, DATING, OTHER.
    """
    token = _extract_token(config)
    raw = await backend_client.get("/api/expenses", token)
    expenses = [ExpenseItem(**item) for item in raw.get("data", [])]

    if category and category.strip().upper() in VALID_CATEGORIES:
        cat_upper = category.strip().upper()
        expenses = [e for e in expenses if e.category == cat_upper]

    if year:
        expenses = [e for e in expenses if e.expenseDate.year == year]

    if month:
        expenses = [e for e in expenses if e.expenseDate.month == month]

    if min_amount is not None:
        expenses = [e for e in expenses if e.amount >= Decimal(str(min_amount))]

    if keyword:
        kw = keyword.strip().lower()
        expenses = [e for e in expenses if e.notes and kw in e.notes.lower()]

    total = sum((e.amount for e in expenses), Decimal("0"))

    return {
        "matchingCount": len(expenses),
        "matchingTotalAmount": str(total),
        "expenses": [e.model_dump(mode="json") for e in expenses],
    }


@tool
async def analyze_all_time_spending_habits(config: RunnableConfig) -> dict:
    """
    Perform a complete behavioral spending audit across all historical expenses:
    discretionary vs. essential ratio, average monthly spend vs. target spending budget,
    highest single expenses, and category optimization targets.
    """
    token = _extract_token(config)
    context = await financial_data_service.get_complete_financial_context(token)

    discretionary_total = sum(
        (
            c.totalAmount
            for c in context.allTimeCategoryBreakdown
            if c.category in DISCRETIONARY_CATEGORIES
        ),
        Decimal("0"),
    )

    essential_total = context.totalAllTimeSpent - discretionary_total

    category_analysis = [
        {
            "category": c.category,
            "allTimeSpent": str(c.totalAmount),
            "totalTransactions": c.transactionCount,
            "avgPerTransaction": str(
                (c.totalAmount / Decimal(max(c.transactionCount, 1))).quantize(Decimal("0.01"))
            ),
            "pctOfAllTimeSpend": (
                round(float(c.totalAmount / context.totalAllTimeSpent) * 100, 1)
                if context.totalAllTimeSpent > 0
                else 0.0
            ),
            "type": (
                "discretionary"
                if c.category in DISCRETIONARY_CATEGORIES
                else "essential"
            ),
        }
        for c in context.allTimeCategoryBreakdown
    ]

    top_single_expenses = sorted(
        context.allExpenses,
        key=lambda e: e.amount,
        reverse=True
    )[:10]

    return {
        "currency": context.profile.currency,
        "monthlyIncome": str(context.profile.monthlyIncome),
        "savingsGoal": str(context.profile.savingsGoal),
        "monthlySpendingBudget": str(context.monthlySpendingBudget),
        "averageMonthlySpend": str(context.averageMonthlySpend),
        "isAvgSpendOverMonthlyBudget": context.averageMonthlySpend > context.monthlySpendingBudget,
        "totalAllTimeSpent": str(context.totalAllTimeSpent),
        "discretionarySpendTotal": str(discretionary_total),
        "essentialSpendTotal": str(essential_total),
        "monthlyTrend": [m.model_dump(mode="json") for m in context.monthlyTrend],
        "categoryAnalysis": category_analysis,
        "top10LargestExpenses": [e.model_dump(mode="json") for e in top_single_expenses],
    }


FINANCIAL_TOOLS = [
    get_complete_financial_overview,
    search_user_expenses,
    analyze_all_time_spending_habits,
]