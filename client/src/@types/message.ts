/* 

export interface Message {
  _id: string;
  timestamp: string;
  fromUserId: string;
  toUserId: string;
  message: string;
}

*/

/*

import type { User } from "./user";

export interface BaseMessage {
  _id: string;
  timestamp: string;
  fromUserId: string;
  toUserId: string;
  message: string;
}

export interface PopulatedMessage extends BaseMessage {
  sender?: User;
  recipient?: User;
}

*/

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
