import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    // Current Month
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // Fetch Profile
    const profile = await prisma.userProfile.findUnique({
      where: {
        userId
      }
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found."
      });
      return;
    }

    // Fetch Current Month Expenses
    const expenses = await prisma.expense.findMany({

      where: {
        userId,

        expenseDate: {
          gte: startOfMonth,
          lt: endOfMonth
        }
      },

      orderBy: {
        expenseDate: "desc"
      }

    });

    /*
    =====================================
    CALCULATIONS
    =====================================
    */

    const totalSpent = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    const spendingBudget =
      Number(profile.monthlyIncome) -
      Number(profile.savingsGoal);

    const remainingBudget =
      spendingBudget - totalSpent;

    /*
    =====================================
    CATEGORY BREAKDOWN
    =====================================
    */

    const categoryBreakdown: Record<string, number> = {};

    for (const expense of expenses) {

      const category = expense.category;

      categoryBreakdown[category] =
        (categoryBreakdown[category] || 0)
        + Number(expense.amount);

    }

    /*
    =====================================
    TOP CATEGORY
    =====================================
    */

    let topCategory = "";

    let topCategoryAmount = 0;

    for (const category in categoryBreakdown) {

      if (categoryBreakdown[category] > topCategoryAmount) {

        topCategory = category;

        topCategoryAmount =
          categoryBreakdown[category];

      }

    }

    /*
    =====================================
    RECENT EXPENSES
    =====================================
    */

    const recentExpenses =
      expenses.slice(0, 5);

    /*
    =====================================
    RESPONSE
    =====================================
    */

    res.status(200).json({

      success: true,

      data: {

        monthlyIncome:
          Number(profile.monthlyIncome),

        savingsGoal:
          Number(profile.savingsGoal),

        spendingBudget,

        totalSpent,

        remainingBudget,

        totalExpenses:
          expenses.length,

        topCategory,

        categoryBreakdown,

        recentExpenses

      }

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};