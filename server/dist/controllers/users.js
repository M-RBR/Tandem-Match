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
exports.deleteUser = exports.getUserById = exports.getMatches = exports.addDislike = exports.addLike = exports.addMatch = exports.getAllUsers = exports.getActiveUser = exports.login = exports.updateUser = exports.register = void 0;
const mongoose_1 = require("mongoose");
const errorHandling_1 = require("../utils/errorHandling");
const users_1 = __importDefault(require("../models/users"));
const hashPassword_1 = require("../utils/hashPassword");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const imageManagement_1 = require("../utils/imageManagement");
const messages_1 = __importDefault(require("../models/messages"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Both email and password are required" });
        }
        const existingUser = yield users_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const encryptedPassword = yield (0, hashPassword_1.encryptPassword)(password);
        const newUser = yield users_1.default.create({
            email,
            password: encryptedPassword,
        });
        const token = (0, generateToken_1.generateToken)(newUser._id.toString(), newUser.email);
        const userResponse = yield users_1.default.findById(newUser._id)
            .select("-password -__v")
            .lean();
        res.status(201).json({
            validated: true,
            token,
            user: userResponse,
        });
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.register = register;
// NEW/UPDATE USER
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const body = req.body;
        console.log("Attempting to update user with ID:", _id);
        console.log("Request body keys:", Object.keys(body));
        const userExists = yield users_1.default.exists({ _id: new mongoose_1.Types.ObjectId(_id) });
        console.log("User exists in DB:", userExists);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }
        if (req.file) {
            body.image = yield (0, imageManagement_1.imageUpload)(req.file, "MERN-project/user_profiles");
            console.log("Uploaded image URL:", body.image);
        }
        if (body.spoken_languages && typeof body.spoken_languages === "string") {
            try {
                body.spoken_languages = JSON.parse(body.spoken_languages);
            }
            catch (e) {
                console.error("Failed to parse spoken_languages:", e);
                return res
                    .status(400)
                    .json({ error: "Invalid spoken_languages format" });
            }
        }
        if (body.learning_languages &&
            typeof body.learning_languages === "string") {
            try {
                body.learning_languages = JSON.parse(body.learning_languages);
            }
            catch (e) {
                console.error("Failed to parse learning_languages:", e);
                return res
                    .status(400)
                    .json({ error: "Invalid learning_languages format" });
            }
        }
        body.updatedAt = new Date();
        const updatedUser = yield users_1.default.findByIdAndUpdate(_id, body, {
            new: true,
            runValidators: true,
        }).select("-password -__v");
        if (!updatedUser) {
            console.error("Update failed for user ID:", _id);
            return res.status(404).json({ error: "User update failed" });
        }
        console.log("Successfully updated user:", {
            _id: updatedUser._id,
            email: updatedUser.email,
        });
        res.status(200).json({
            _id: updatedUser._id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            dob_day: updatedUser.dob_day,
            gender_identity: updatedUser.gender_identity,
            gender_interest: updatedUser.gender_interest,
            spoken_languages: updatedUser.spoken_languages,
            learning_languages: updatedUser.learning_languages,
            image: updatedUser.image,
            about: updatedUser.about,
            createdAt: updatedUser.createdAt,
        });
    }
    catch (error) {
        console.error("Error in updateUser:", error);
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.updateUser = updateUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Both email and password are required" });
        }
        const user = yield users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.email);
        const userResponse = yield users_1.default.findById(user._id)
            .select("-password -__v")
            .lean();
        res.status(200).json({
            validated: true,
            token,
            user: userResponse,
        });
    }
    catch (err) {
        (0, errorHandling_1.handleError)(err, res);
    }
});
exports.login = login;
const getActiveUser = (req, res) => {
    res.status(200).json({
        message: "Token validated",
        user: req.user,
    });
};
exports.getActiveUser = getActiveUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const currentUser = yield users_1.default.findById(currentUserId);
        const likedIds = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.likedUsers) || [];
        const dislikedIds = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dislikedUsers) || [];
        const seenIds = [...likedIds, ...dislikedIds, currentUserId];
        const users = yield users_1.default.find({ _id: { $nin: seenIds } })
            .select("-password -__v")
            .lean();
        res.json(users);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.getAllUsers = getAllUsers;
// MATCHES
const addMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { matchId } = req.body;
        if (!matchId) {
            return res.status(400).json({ error: "matchId is required" });
        }
        const user = yield users_1.default.findById(currentUserId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        if (!user.matches)
            user.matches = [];
        if (!user.matches.includes(matchId)) {
            user.matches.push(matchId);
            yield user.save();
        }
        res
            .status(200)
            .json({ success: true, message: "Match added", matches: user.matches });
    }
    catch (error) {
        console.error("Error adding match:", error);
        res.status(500).json({ error: "Failed to add match" });
    }
});
exports.addMatch = addMatch;
// LIKED PROFILES
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { likedUserId } = req.body;
        if (!likedUserId) {
            return res.status(400).json({ error: "likedUserId is required" });
        }
        const currentUser = yield users_1.default.findById(currentUserId);
        if (!currentUser)
            return res.status(404).json({ error: "User not found" });
        if (!currentUser.likedUsers)
            currentUser.likedUsers = [];
        if (!currentUser.dislikedUsers)
            currentUser.dislikedUsers = [];
        currentUser.dislikedUsers = currentUser.dislikedUsers.filter((id) => !id.equals(likedUserId));
        if (!currentUser.likedUsers.some((id) => id.equals(likedUserId))) {
            currentUser.likedUsers.push(likedUserId);
        }
        yield currentUser.save();
        const likedUser = yield users_1.default.findById(likedUserId);
        if ((_b = likedUser === null || likedUser === void 0 ? void 0 : likedUser.likedUsers) === null || _b === void 0 ? void 0 : _b.includes(currentUserId)) {
            if (!currentUser.matches)
                currentUser.matches = [];
            if (!likedUser.matches)
                likedUser.matches = [];
            if (!currentUser.matches.some((id) => id.equals(likedUserId))) {
                currentUser.matches.push(likedUserId);
            }
            if (!likedUser.matches.some((id) => id.equals(currentUserId))) {
                likedUser.matches.push(currentUserId);
            }
            yield Promise.all([currentUser.save(), likedUser.save()]);
            return res.status(200).json({
                success: true,
                isMatch: true,
                matches: currentUser.matches,
            });
        }
        res.status(200).json({
            success: true,
            isMatch: false,
            likedUsers: currentUser.likedUsers,
        });
    }
    catch (error) {
        console.error("Error adding like:", error);
        res.status(500).json({ error: "Failed to add like" });
    }
});
exports.addLike = addLike;
// DISLIKED PROFILES
const addDislike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { dislikedUserId } = req.body;
        if (!dislikedUserId) {
            return res.status(400).json({ error: "dislikedUserId is required" });
        }
        const currentUser = yield users_1.default.findById(currentUserId);
        if (!currentUser)
            return res.status(404).json({ error: "User not found" });
        if (!currentUser.dislikedUsers)
            currentUser.dislikedUsers = [];
        if (!currentUser.likedUsers)
            currentUser.likedUsers = [];
        currentUser.likedUsers = currentUser.likedUsers.filter((id) => !id.equals(dislikedUserId));
        if (!currentUser.dislikedUsers.some((id) => id.equals(dislikedUserId))) {
            currentUser.dislikedUsers.push(dislikedUserId);
        }
        yield currentUser.save();
        res.status(200).json({
            success: true,
            dislikedUsers: currentUser.dislikedUsers,
        });
    }
    catch (error) {
        console.error("Error adding dislike:", error);
        res.status(500).json({ error: "Failed to add dislike" });
    }
});
exports.addDislike = addDislike;
const getMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUser = yield users_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)
            .select("matches")
            .populate({
            path: "matches",
            select: "first_name image",
            model: users_1.default,
        })
            .lean();
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(currentUser.matches || []);
    }
    catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({
            error: "Failed to fetch matches",
            details: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getMatches = getMatches;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { _id } = req.params;
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (_id !== (currentUserId === null || currentUserId === void 0 ? void 0 : currentUserId.toString())) {
            return res
                .status(403)
                .json({ error: "Unauthorized to delete this account" });
        }
        const user = yield users_1.default.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(`Starting hard delete for user: ${_id}`);
        if (user.image) {
            try {
                yield (0, imageManagement_1.imageDelete)(user.image);
                console.log(`Deleted Cloudinary image for user: ${_id}`);
            }
            catch (error) {
                console.error("Failed to delete image from Cloudinary:", error);
            }
        }
        const deletedMessages = yield messages_1.default.deleteMany({
            $or: [{ fromUserId: _id }, { toUserId: _id }],
        });
        console.log(`Deleted ${deletedMessages.deletedCount} messages for user: ${_id}`);
        const updateResult = yield users_1.default.updateMany({
            $or: [{ matches: _id }, { likedUsers: _id }, { dislikedUsers: _id }],
        }, {
            $pull: {
                matches: _id,
                likedUsers: _id,
                dislikedUsers: _id,
            },
        });
        console.log(`Updated ${updateResult.modifiedCount} users to remove references to deleted user: ${_id}`);
        yield users_1.default.findByIdAndDelete(_id);
        console.log(`Successfully hard-deleted user document: ${_id}`);
        res.status(200).json({
            success: true,
            message: "Profile permanently deleted",
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.deleteUser = deleteUser;
