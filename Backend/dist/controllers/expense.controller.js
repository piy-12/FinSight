"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.getExpenseById = exports.getExpenses = exports.createExpense = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createExpense = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { amount, category, notes, expenseDate, receiptUrl } = req.body;
        const expense = await prisma_1.default.expense.create({
            data: {
                amount,
                category,
                notes,
                expenseDate: new Date(expenseDate),
                receiptUrl,
                userId: userId
            }
        });
        res.status(201).json({
            success: true,
            message: "Expense added successfully.",
            data: expense
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
exports.createExpense = createExpense;
const getExpenses = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const expenses = await prisma_1.default.expense.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getExpenses = getExpenses;
const getExpenseById = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const expense = await prisma_1.default.expense.findFirst({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getExpenseById = getExpenseById;
const updateExpense = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const existingExpense = await prisma_1.default.expense.findFirst({
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
        const updatedExpense = await prisma_1.default.expense.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const expense = await prisma_1.default.expense.findFirst({
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
        await prisma_1.default.expense.delete({
            where: {
                id
            }
        });
        res.status(200).json({
            success: true,
            message: "Expense deleted successfully."
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
exports.deleteExpense = deleteExpense;
