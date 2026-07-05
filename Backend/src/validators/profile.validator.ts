import { Request, Response, NextFunction } from "express";

export const validateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const { monthlyIncome, savingsGoal } = req.body;

  if (
    monthlyIncome === undefined ||
    savingsGoal === undefined
  ) {
    res.status(400).json({
      success: false,
      message: "Monthly income and savings goal are required."
    });
    return;
  }

  if (monthlyIncome <= 0) {
    res.status(400).json({
      success: false,
      message: "Monthly income must be greater than 0."
    });
    return;
  }

  if (savingsGoal < 0) {
    res.status(400).json({
      success: false,
      message: "Savings goal cannot be negative."
    });
    return;
  }

  if (savingsGoal > monthlyIncome) {
    res.status(400).json({
      success: false,
      message: "Savings goal cannot exceed monthly income."
    });
    return;
  }

  next();
};