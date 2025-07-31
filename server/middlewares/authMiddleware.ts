import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret!);
    (req as any).user = decoded; // you can optionally type this better later
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
