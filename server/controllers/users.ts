/*

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

    // Return full user data
    const userResponse = await UserModel.findById(newUser._id)
      .select("-password -__v -updatedAt")
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const body = req.body;

    console.log("Attempting to update user with ID:", _id);
    console.log("Request body keys:", Object.keys(body));

    // Verify the user exists first
    const userExists = await UserModel.exists({ _id: new Types.ObjectId(_id) });
    console.log("User exists in DB:", userExists);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle file upload if present
    if (req.file) {
      body.image = await imageUpload(req.file, "MERN-project/user_profiles");
      console.log("Uploaded image URL:", body.image);
    }

    // Parse language arrays if they exist and are strings
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

    // Add updatedAt timestamp
    body.updatedAt = new Date();

    const updatedUser = await UserModel.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true, // Ensures updates match schema
    }).select("-password -__v -updatedAt");

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

    // Return full user data
    const userResponse = await UserModel.findById(user._id)
      .select("-password -__v -updatedAt")
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
    const users = await UserModel.find()
      .select("-password -__v -updatedAt")
      .lean();
    res.json(users);
  } catch (error) {
    handleError(error, res);
  }
};

*/

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

    // Return full user data
    const userResponse = await UserModel.findById(newUser._id)
      .select("-password -__v -updatedAt")
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const body = req.body;

    console.log("Attempting to update user with ID:", _id);
    console.log("Request body keys:", Object.keys(body));

    // Verify the user exists first
    const userExists = await UserModel.exists({ _id: new Types.ObjectId(_id) });
    console.log("User exists in DB:", userExists);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle file upload if present
    if (req.file) {
      body.image = await imageUpload(req.file, "MERN-project/user_profiles");
      console.log("Uploaded image URL:", body.image);
    }

    // Parse language arrays if they exist and are strings
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

    // Add updatedAt timestamp
    body.updatedAt = new Date();

    const updatedUser = await UserModel.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true, // Ensures updates match schema
    }).select("-password -__v -updatedAt");

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

    // Return full user data
    const userResponse = await UserModel.findById(user._id)
      .select("-password -__v -updatedAt")
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
    const users = await UserModel.find()
      .select("-password -__v -updatedAt")
      .lean();
    res.json(users);
  } catch (error) {
    handleError(error, res);
  }
};

export const addMatch = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const { matchId } = req.body; // ID of the liked user

    if (!matchId) {
      return res.status(400).json({ error: "matchId is required" });
    }

    // Prevent duplicate matches
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
