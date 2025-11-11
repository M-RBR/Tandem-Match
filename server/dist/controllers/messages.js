"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messages_1 = __importDefault(require("../models/messages"));
const errorHandling_1 = require("../utils/errorHandling");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, matchId } = req.params;
        const shouldPopulate = req.query.populate === "true";
        let query = messages_1.default.find({
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
        const messages = yield query.exec();
        res.json(messages);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { toUserId, message } = req.body;
        const fromUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!toUserId || !message) {
            return res.status(400).json({
                error: "Missing required fields",
                details: {
                    received: req.body,
                    required: ["toUserId", "message"],
                },
            });
        }
        const fromUser = yield mongoose_1.default.model("User").findById(fromUserId);
        const toUser = yield mongoose_1.default.model("User").findById(toUserId);
        if (!((_b = fromUser === null || fromUser === void 0 ? void 0 : fromUser.matches) === null || _b === void 0 ? void 0 : _b.includes(new mongoose_1.default.Types.ObjectId(toUserId)))) {
            return res.status(403).json({
                error: "Users must be matched to message",
                yourMatches: fromUser === null || fromUser === void 0 ? void 0 : fromUser.matches,
            });
        }
        const newMessage = yield messages_1.default.create({
            fromUserId,
            toUserId,
            message,
        });
        const populatedMessage = yield messages_1.default.populate(newMessage, {
            path: "fromUserId",
            select: "first_name image",
        });
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error("Message creation failed:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.sendMessage = sendMessage;
