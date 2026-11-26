import hashlib
import json
from typing import Annotated, Optional, TypedDict

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

from app.core.config import settings
from app.services.financial_data_service import financial_data_service
from app.tools import FINANCIAL_TOOLS

ADVISOR_SYSTEM_PROMPT = """You are FinSight AI, a friendly, practical personal finance assistant inside the FinSight app.

STRICT TOPIC GUARDRAIL:
- You ONLY discuss personal finance: expenses, budgets, savings goals, income, bills, debt, and spending habits.
- If the user asks about ANYTHING unrelated to finance (coding, movies, sports, general knowledge, health, weather, etc.), politely refuse in 1-2 sentences and redirect back to their finances. Example: "I'm FinSight AI, so I can only help with personal finance, budgeting, and your expenses. What would you like to check in your finances today?"

CONVERSATION RULES:
- Talk naturally like a helpful human advisor in a normal back-and-forth chat—warm, direct, and concise (2 to 4 sentences per reply unless the user asks for a detailed breakdown).
- NEVER dump the user's entire financial summary, full ledger, or every category at once unless they explicitly ask for a "full summary" or "complete overview".
- Answer ONLY the specific question asked. Use the snapshot below silently as background context, and call your tools (`search_user_expenses`, `analyze_all_time_spending_habits`, `get_complete_financial_overview`) only when you need specific transaction details or deeper history.
- If the user just greets you ("hi", "hello"), reply briefly and ask how you can help with their budget or expenses.
- Ground every number in actual user data and format currency in the user's profile currency (e.g., INR / ₹). Never invent numbers.

User Financial Snapshot (Background context—do not recite unless asked):
{complete_financial_context}
"""


class FinancialAgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    complete_financial_context: Optional[str]


async def gather_context_node(
    state: FinancialAgentState,
    config: RunnableConfig,
) -> dict:
    token = config.get("configurable", {}).get("access_token")
    if not token:
        return {"complete_financial_context": "Authentication token missing."}

    try:
        context = await financial_data_service.get_complete_financial_context(token)

        payload = {
            "profile": {
                "currency": context.profile.currency,
                "monthlyIncome": str(context.profile.monthlyIncome),
                "savingsGoal": str(context.profile.savingsGoal),
                "monthlySpendingBudget": str(context.monthlySpendingBudget),
            },
            "currentMonthStatus": {
                "currentMonthSpent": str(context.currentMonthSpent),
                "currentMonthRemainingBudget": str(context.currentMonthRemainingBudget),
            },
            "highLevelSummary": {
                "totalAllTimeSpent": str(context.totalAllTimeSpent),
                "totalAllTimeTransactions": context.totalAllTimeTransactions,
                "averageMonthlySpend": str(context.averageMonthlySpend),
                "allTimeTopCategory": context.allTimeTopCategory,
            },
        }

        return {"complete_financial_context": json.dumps(payload)}
    except Exception as exc:
        return {"complete_financial_context": f"Could not load financial context: {exc}"}


async def advisor_node(state: FinancialAgentState) -> dict:
    llm = ChatGroq(
        model=settings.GROQ_MODEL,
        api_key=settings.GROQ_API_KEY,
        temperature=0.3,
        max_tokens=350,
    ).bind_tools(FINANCIAL_TOOLS)

    context_str = state.get("complete_financial_context") or "Not available"
    system_msg = SystemMessage(
        content=ADVISOR_SYSTEM_PROMPT.format(complete_financial_context=context_str)
    )

    recent_messages = state["messages"][-10:]
    response = await llm.ainvoke([system_msg, *recent_messages])
    return {"messages": [response]}


def build_financial_graph():
    workflow = StateGraph(FinancialAgentState)

    workflow.add_node("gather_context", gather_context_node)
    workflow.add_node("advisor", advisor_node)
    workflow.add_node("tools", ToolNode(FINANCIAL_TOOLS))

    workflow.add_edge(START, "gather_context")
    workflow.add_edge("gather_context", "advisor")
    workflow.add_conditional_edges("advisor", tools_condition)
    workflow.add_edge("tools", "advisor")

    return workflow.compile(checkpointer=MemorySaver())


financial_chat_graph = build_financial_graph()


async def run_financial_chat(
    message: str,
    access_token: str,
    thread_id: Optional[str] = None,
) -> tuple[str, str]:
    if not thread_id:
        token_hash = hashlib.sha256(access_token.encode("utf-8")).hexdigest()[:16]
        thread_id = f"finsight_user_{token_hash}"

    config = {
        "configurable": {
            "thread_id": thread_id,
            "access_token": access_token,
        }
    }

    result = await financial_chat_graph.ainvoke(
        {"messages": [HumanMessage(content=message)]},
        config=config,
    )

    last_msg = result["messages"][-1]
    reply = (
        last_msg.content
        if isinstance(last_msg.content, str)
        else str(last_msg.content)
    )
    return reply, thread_id