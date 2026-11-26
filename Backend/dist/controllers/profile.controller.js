"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.createProfile = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { monthlyIncome, savingsGoal } = req.body;
        const existingProfile = await prisma_1.default.userProfile.findUnique({
            where: {
                userId
            }
        });
        if (existingProfile) {
            res.status(400).json({
                success: false,
                message: "Profile already exists."
            });
            return;
        }
        const profile = await prisma_1.default.userProfile.create({
            data: {
                monthlyIncome,
                savingsGoal,
                userId: userId
            }
        });
        res.status(201).json({
            success: true,
            message: "Profile created successfully.",
            profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.createProfile = createProfile;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const profile = await prisma_1.default.userProfile.findUnique({
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
        const spendingBudget = Number(profile.monthlyIncome) -
            Number(profile.savingsGoal);
        res.status(200).json({
            success: true,
            profile: {
                ...profile,
                spendingBudget
            }
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { monthlyIncome, savingsGoal } = req.body;
        const updatedProfile = await prisma_1.default.userProfile.update({
            where: {
                userId
            },
            data: {
                monthlyIncome,
                savingsGoal
            }
        });
        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            profile: updatedProfile
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.updateProfile = updateProfile;
