import express from "express";
import { jwtAuth } from "../middlewares/jwt";
import { getMessages, sendMessage } from "../controllers/messages";

const router = express.Router();

// send a message
router.post("/send", jwtAuth, sendMessage);

// get messages between two users
router.get("/chat/:userId/:matchId", jwtAuth, getMessages);

export default router;
