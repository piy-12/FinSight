import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import expenseRoutes from "./routes/expense.routes";

const app: Application = express();

app.use(cors());



app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/expenses',expenseRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FinSight API Running",
  });
});

export default app;