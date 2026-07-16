import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    const {
      amount,
      category,
      notes,
      expenseDate,
      receiptImageUrl
    } = req.body;

    const expense = await prisma.expense.create({

      data: {

        amount,

        category,

        notes,

        expenseDate: new Date(expenseDate),

        receiptImageUrl,

        userId: userId!

      }

    });

    res.status(201).json({

      success: true,

      message: "Expense added successfully.",

      data: expense

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};

export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    const expenses = await prisma.expense.findMany({

      where: {

        userId

      },

      orderBy: {

        expenseDate: "desc"

      }

    });

    res.status(200).json({

      success: true,

      data: expenses

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};


export const getExpenseById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    const { id } = req.params;

    const expense = await prisma.expense.findFirst({

      where: {

        id,

        userId

      }

    });

    if (!expense) {

      res.status(404).json({

        success: false,

        message: "Expense not found."

      });

      return;

    }

    res.status(200).json({

      success: true,

      data: expense

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};

export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    const { id } = req.params;

    const existingExpense = await prisma.expense.findFirst({

      where: {

        id,

        userId

      }

    });

    if (!existingExpense) {

      res.status(404).json({

        success: false,

        message: "Expense not found."

      });

      return;

    }

    const updatedExpense = await prisma.expense.update({

      where: {

        id

      },

      data: {

        ...req.body,

        expenseDate: req.body.expenseDate
          ? new Date(req.body.expenseDate)
          : undefined

      }

    });

    res.status(200).json({

      success: true,

      message: "Expense updated successfully.",

      data: updatedExpense

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    const { id } = req.params;

    const expense = await prisma.expense.findFirst({

      where: {

        id,

        userId

      }

    });

    if (!expense) {

      res.status(404).json({

        success: false,

        message: "Expense not found."

      });

      return;

    }

    await prisma.expense.delete({

      where: {

        id

      }

    });

    res.status(200).json({

      success: true,

      message: "Expense deleted successfully."

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Internal Server Error"

    });

  }

};