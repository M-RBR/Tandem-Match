"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const languageSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, required: true },
});
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, trim: true, minLength: 2 },
    dob_day: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ }, // now stored as ISO string, perhaps chage to 'Date type'?
    gender_identity: { type: String, enum: ["man", "woman", "diverse"] },
    gender_interest: { type: String, enum: ["men", "women", "everyone"] },
    about: { type: String, maxLength: 600 },
    image: { type: String },
    spoken_languages: [languageSchema],
    learning_languages: [languageSchema],
    dislikedUsers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
    likedUsers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
    matches: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
}, { timestamps: true, collection: "users" });
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
