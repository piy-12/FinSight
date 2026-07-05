import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.userId;

    const { monthlyIncome, savingsGoal } = req.body;

    const existingProfile = await prisma.userProfile.findUnique({
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

    const profile = await prisma.userProfile.create({
      data: {
        monthlyIncome,
        savingsGoal,
        userId: userId!
      }
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profile
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

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

    const spendingBudget =
      Number(profile.monthlyIncome) -
      Number(profile.savingsGoal);

    res.status(200).json({
      success: true,
      profile: {
        ...profile,
        spendingBudget
      }
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = req.user?.id;

    const { monthlyIncome, savingsGoal } = req.body;

    const updatedProfile = await prisma.userProfile.update({
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

  } catch {

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};