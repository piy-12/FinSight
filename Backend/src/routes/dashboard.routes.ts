import { Router } from "express";

import authMiddleware from "../middlware/auth.middleware";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getDashboard
);

export default router;