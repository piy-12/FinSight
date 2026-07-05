import { Router } from "express";

import authMiddleware from "../middlware/auth.middleware";

import {
  createProfile,
  getProfile,
  updateProfile
} from "../controllers/profile.controller";

import { validateProfile } from "../validators/profile.validator";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateProfile,
  createProfile
);

router.get(
  "/",
  authMiddleware,
  getProfile
);

router.put(
  "/",
  authMiddleware,
  validateProfile,
  updateProfile
);

export default router;