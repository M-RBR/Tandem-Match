/* 

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
      // add other user properties like _id and email?
    }
  }
}

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
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await UserModel.findById(decoded.sub).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Optional: Logger middleware
export const testingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
};

*/

/* NEW 

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import UserModel from "../models/users";

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId; // instead of "_id: string;" - updated interface to match Mongoose types
        email: string;
        first_name?: string;
        dob_day?: string;
        gender_identity?: "man" | "woman" | "diverse";
        gender_interest?: "men" | "women" | "everyone";
        about?: string;
        image?: string;
        spoken_languages?: Types.Array<{
          code: string;
          name: string;
          level: string;
        }>;
        learning_languages?: Types.Array<{
          code: string;
          name: string;
          level: string;
        }>;
        matches?: Types.Array<Types.ObjectId>;
        createdAt?: Date;
        updatedAt?: Date;
      };
    }
  }
}

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
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await UserModel.findById(decoded.sub).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // instead of "req.user = user.toObject();""
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// optional for debugging, revise need later

export const testingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
};

*/

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import UserModel from "../models/users";

interface JwtPayload {
  sub: string; // user ID (= subject identifier)
  email: string;
  iat?: number; // issued at timestamp
  exp?: number; // expiration timestamp
}

type UserDocument = {
  _id: Types.ObjectId;
  email: string;
  first_name?: string | null;
  dob_day?: string | null;
  gender_identity?: "man" | "woman" | "diverse" | null;
  gender_interest?: "men" | "women" | "everyone" | null;
  about?: string | null;
  image?: string | null;
  spoken_languages?: Types.Array<{
    code: string;
    name: string;
    level: string;
  }> | null;
  learning_languages?: Types.Array<{
    code: string;
    name: string;
    level: string;
  }> | null;
  matches?: Types.Array<Types.ObjectId> | null;
  createdAt?: Date;
  updatedAt?: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

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
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await UserModel.findById(decoded.sub)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user as UserDocument;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// extra log for debugging, revise later if necessary

export const testingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
};
