import type { User } from "./user";

export interface BaseMessage {
  _id: string;
  createdAt: string;
  updatedAt: string;
  message: string;
}

export interface PopulatedMessage extends BaseMessage {
  fromUserId: Pick<User, "_id" | "first_name" | "image">;
  toUserId: Pick<User, "_id" | "first_name" | "image">;
}
