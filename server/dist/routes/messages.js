"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../middlewares/jwt");
const messages_1 = require("../controllers/messages");
const router = express_1.default.Router();
// send a message
router.post("/send", jwt_1.jwtAuth, messages_1.sendMessage);
// get messages between two users
router.get("/chat/:userId/:matchId", jwt_1.jwtAuth, messages_1.getMessages);
exports.default = router;
