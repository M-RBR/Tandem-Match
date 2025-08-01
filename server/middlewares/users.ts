/* 

import { NextFunction, Request, Response } from "express";

export const testingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.method, req.path);

  const value = false; //  replace with  real condition

  if (value) {
    next(); // pass control to the next middleware or route
  } else {
    res.status(500).json({ error: "value is false" });
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

*/

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/users";

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any; // replace 'any' with custom user type later
    }
  }
}

export const testingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
};

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET not defined in environment / check env");
    return res
      .status(500)
      .json({ error: "Server configuration error / no secret" });
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log(decoded);
    const user = await UserModel.findById(decoded.sub).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
