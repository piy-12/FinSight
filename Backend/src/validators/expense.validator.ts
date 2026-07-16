import { Request, Response, NextFunction } from "express";

const validCategories = [
  "FOOD",
  "RENT",
  "TRANSPORT",
  "SHOPPING",
  "ENTERTAINMENT",
  "LIFESTYLE",
  "HEALTH",
  "EDUCATION",
  "UTILITIES",
  "TRAVEL",
  "DATING",
  "OTHER",
];

export const validateExpense = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const {
    amount,
    category,
    expenseDate,
  } = req.body;

  if (
    amount === undefined ||
    !category ||
    !expenseDate
  ) {
    res.status(400).json({
      success: false,
      message: "Amount, category and expense date are required."
    });
    return;
  }

  if (Number(amount) <= 0) {
    res.status(400).json({
      success: false,
      message: "Amount must be greater than zero."
    });
    return;
  }

  if (!validCategories.includes(category)) {
    res.status(400).json({
      success: false,
      message: "Invalid expense category."
    });
    return;
  }

  next();
};