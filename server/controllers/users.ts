import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleError } from "../utils/errorHandling";
import UserModel from "../models/users";
import { encryptPassword } from "../utils/hashPassword";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { imageUpload } from "../utils/imageManagement";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const encryptedPassword = await encryptPassword(password);
    const newUser = await UserModel.create({
      email,
      password: encryptedPassword,
    });

    const token = generateToken(newUser._id.toString(), newUser.email);

    const userResponse = await UserModel.findById(newUser._id)
      .select("-password -__v")
      .lean();

    res.status(201).json({
      validated: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// NEW/UPDATE USER

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const body = req.body;

    console.log("Attempting to update user with ID:", _id);
    console.log("Request body keys:", Object.keys(body));

    const userExists = await UserModel.exists({ _id: new Types.ObjectId(_id) });
    console.log("User exists in DB:", userExists);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      body.image = await imageUpload(req.file, "MERN-project/user_profiles");
      console.log("Uploaded image URL:", body.image);
    }

    if (body.spoken_languages && typeof body.spoken_languages === "string") {
      try {
        body.spoken_languages = JSON.parse(body.spoken_languages);
      } catch (e) {
        console.error("Failed to parse spoken_languages:", e);
        return res
          .status(400)
          .json({ error: "Invalid spoken_languages format" });
      }
    }

    if (
      body.learning_languages &&
      typeof body.learning_languages === "string"
    ) {
      try {
        body.learning_languages = JSON.parse(body.learning_languages);
      } catch (e) {
        console.error("Failed to parse learning_languages:", e);
        return res
          .status(400)
          .json({ error: "Invalid learning_languages format" });
      }
    }

    body.updatedAt = new Date();

    const updatedUser = await UserModel.findByIdAndUpdate(_id, body, {
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
  } catch (error) {
    console.error("Error in updateUser:", error);
    handleError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.email);

    const userResponse = await UserModel.findById(user._id)
      .select("-password -__v")
      .lean();

    res.status(200).json({
      validated: true,
      token,
      user: userResponse,
    });
  } catch (err) {
    handleError(err, res);
  }
};

export const getActiveUser = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Token validated",
    user: req.user,
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const currentUser = await UserModel.findById(currentUserId);

    const likedIds = currentUser?.likedUsers || [];
    const dislikedIds = currentUser?.dislikedUsers || [];
    const seenIds = [...likedIds, ...dislikedIds, currentUserId];

    const users = await UserModel.find({ _id: { $nin: seenIds } })
      .select("-password -__v")
      .lean();

    res.json(users);
  } catch (error) {
    handleError(error, res);
  }
};

// MATCHES

export const addMatch = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const { matchId } = req.body;

    if (!matchId) {
      return res.status(400).json({ error: "matchId is required" });
    }

    const user = await UserModel.findById(currentUserId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.matches) user.matches = [];
    if (!user.matches.includes(matchId)) {
      user.matches.push(matchId as any);
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Match added", matches: user.matches });
  } catch (error) {
    console.error("Error adding match:", error);
    res.status(500).json({ error: "Failed to add match" });
  }
};

// LIKED PROFILES

export const addLike = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const { likedUserId } = req.body;

    if (!likedUserId) {
      return res.status(400).json({ error: "likedUserId is required" });
    }

    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (!currentUser.likedUsers) currentUser.likedUsers = [];
    if (!currentUser.dislikedUsers) currentUser.dislikedUsers = [];

    currentUser.dislikedUsers = currentUser.dislikedUsers.filter(
      (id) => !id.equals(likedUserId)
    );

    if (!currentUser.likedUsers.some((id) => id.equals(likedUserId))) {
      currentUser.likedUsers.push(likedUserId as any);
    }

    await currentUser.save();

    const likedUser = await UserModel.findById(likedUserId);
    if (likedUser?.likedUsers?.includes(currentUserId as any)) {
      if (!currentUser.matches) currentUser.matches = [];
      if (!likedUser.matches) likedUser.matches = [];

      if (!currentUser.matches.some((id) => id.equals(likedUserId))) {
        currentUser.matches.push(likedUserId as any);
      }
      if (!likedUser.matches.some((id) => id.equals(currentUserId))) {
        likedUser.matches.push(currentUserId as any);
      }

      await Promise.all([currentUser.save(), likedUser.save()]);

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
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Failed to add like" });
  }
};

// DISLIKED PROFILES

export const addDislike = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const { dislikedUserId } = req.body;

    if (!dislikedUserId) {
      return res.status(400).json({ error: "dislikedUserId is required" });
    }

    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (!currentUser.dislikedUsers) currentUser.dislikedUsers = [];
    if (!currentUser.likedUsers) currentUser.likedUsers = [];

    currentUser.likedUsers = currentUser.likedUsers.filter(
      (id) => !id.equals(dislikedUserId)
    );

    if (!currentUser.dislikedUsers.some((id) => id.equals(dislikedUserId))) {
      currentUser.dislikedUsers.push(dislikedUserId as any);
    }

    await currentUser.save();

    res.status(200).json({
      success: true,
      dislikedUsers: currentUser.dislikedUsers,
    });
  } catch (error) {
    console.error("Error adding dislike:", error);
    res.status(500).json({ error: "Failed to add dislike" });
  }
};

export const getMatches = async (req: Request, res: Response) => {
  try {
    const currentUser = await UserModel.findById(req.user?._id)
      .select("matches")
      .populate({
        path: "matches",
        select: "first_name image",
        model: UserModel,
      })
      .lean();

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(currentUser.matches || []);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({
      error: "Failed to fetch matches",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
