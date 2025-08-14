import { Request, Response } from "express";
import mongoose from "mongoose";
import MessageModel from "../models/messages";
import { handleError } from "../utils/errorHandling";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId, matchId } = req.params;
    const shouldPopulate = req.query.populate === "true";

    let query = MessageModel.find({
      $or: [
        { fromUserId: userId, toUserId: matchId },
        { fromUserId: matchId, toUserId: userId },
      ],
    }).sort({ createdAt: 1 });

    if (shouldPopulate) {
      query = query.populate([
        {
          path: "fromUserId",
          select: "first_name image",
          model: "User",
        },
        {
          path: "toUserId",
          select: "first_name image",
          model: "User",
        },
      ]);
    }

    const messages = await query.exec();
    res.json(messages);
  } catch (error) {
    handleError(error, res);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { toUserId, message } = req.body;
    const fromUserId = req.user?._id;

    if (!toUserId || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          received: req.body,
          required: ["toUserId", "message"],
        },
      });
    }

    const fromUser = await mongoose.model("User").findById(fromUserId);
    const toUser = await mongoose.model("User").findById(toUserId);

    if (!fromUser?.matches?.includes(new mongoose.Types.ObjectId(toUserId))) {
      return res.status(403).json({
        error: "Users must be matched to message",
        yourMatches: fromUser?.matches,
      });
    }

    const newMessage = await MessageModel.create({
      fromUserId,
      toUserId,
      message,
    });

    const populatedMessage = await MessageModel.populate(newMessage, {
      path: "fromUserId",
      select: "first_name image",
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Message creation failed:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
