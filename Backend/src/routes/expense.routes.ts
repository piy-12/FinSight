import { Router } from "express";

import authMiddleware from "../middlware/auth.middleware"

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "../controllers/expense.controller";

import {
  validateExpense
} from "../validators/expense.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateExpense,
  createExpense
);

router.get(
  "/",
  authMiddleware,
  getExpenses
);

router.get(
  "/:id",
  authMiddleware,
  getExpenseById
);

router.put(
  "/:id",
  authMiddleware,
  validateExpense,
  updateExpense
);

router.delete(
  "/:id",
  authMiddleware,
  deleteExpense
);

export default router;