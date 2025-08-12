/* 

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
  dislikedUsers?: Types.Array<Types.ObjectId> | null;
  likedUsers?: Types.Array<Types.ObjectId> | null;
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

    req.user = user as unknown as UserDocument; // added "unknown" as suggested by TS because of error: "// added this because of the error: Conversion of type 'Document<unknown, {}, { createdAt: NativeDate; updatedAt: NativeDate; } & { email: string; password: string; spoken_languages: DocumentArray<{ name: string; code: string; level: string; }, Subdocument<...> & { ...; }>; ... 7 more ...; image?: string | ... 1 more ... | undefined; }, {}> & { ...; } & { ...; } & { ...;...' to type 'UserDocument' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
    // Types of property 'matches' are incompatible.
    //  Type 'ObjectId[]' is missing the following properties from type 'Array<ObjectId>': $pop, $shift, addToSet, isMongooseArray, and 5 more.""
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
