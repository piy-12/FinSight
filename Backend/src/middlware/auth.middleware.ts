import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access Denied",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }

};

export default authMiddleware;