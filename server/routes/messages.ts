import express from "express";
import { jwtAuth } from "../middlewares/jwt";
import { getMessages, sendMessage } from "../controllers/messages";

const router = express.Router();

// Get messages between two users
router.get("/chat/:userId/:matchId", jwtAuth, getMessages);

// Send a new message
router.post("/send", jwtAuth, sendMessage);

export default router;
