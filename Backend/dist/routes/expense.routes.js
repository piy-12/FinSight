"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlware/auth.middleware"));
const expense_controller_1 = require("../controllers/expense.controller");
const expense_validator_1 = require("../validators/expense.validator");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.default, expense_validator_1.validateExpense, expense_controller_1.createExpense);
router.get("/", auth_middleware_1.default, expense_controller_1.getExpenses);
router.get("/:id", auth_middleware_1.default, expense_controller_1.getExpenseById);
router.put("/:id", auth_middleware_1.default, expense_validator_1.validateExpense, expense_controller_1.updateExpense);
router.delete("/:id", auth_middleware_1.default, expense_controller_1.deleteExpense);
exports.default = router;
