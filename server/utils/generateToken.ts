import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (_id: string, email: string) => {
  const payload = { sub: _id, email };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
