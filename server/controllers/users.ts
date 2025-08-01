import { Request, Response } from "express";
import { handleError } from "../utils/errorHandling";
import UserModel from "../models/users";
import { encryptPassword } from "../utils/hashPassword";
import { comparePassword } from "../utils/hashPassword"; // check the implementation of this line
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "both email and password are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" });
    }
    const encryptedPassword = await encryptPassword(password);
    console.log(encryptedPassword);
    const newUser = await UserModel.create({
      email,
      password: encryptedPassword,
    });
    console.log(newUser);
    const token = generateToken(newUser._id.toString(), newUser.email);
    res.status(201).json({
      validated: true,
      token,
      user: {
        email: newUser.email,
        _id: newUser._id,
        createdAt: newUser.createdAt,
      },
    });

    //  res.status(201).json({ success: true, _id: newUser.id });
    // res.status(201).json({
    //  user: {
    //    email: newUser.email,
    //    _id: newUser._id,
    //    createdAt: newUser.createdAt,
    //  },
    // });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;
    const body = req.body;
    console.log(_id, body);

    const updateUser = await UserModel.findByIdAndUpdate(_id, body, {
      new: true,
    }).select(""); // possible: }).select("-password -updatedAt");
    res.status(200).json(updateUser);
  } catch (error) {
    handleError(error, res);
  }
};

// LOGIN

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("details:", email, password);
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and password are required" });
    }

    // validate email + password correctly formatted

    const user = await UserModel.findOne({ email });
    console.log("found user", user);
    if (!user) {
      return res.status(404).json({ error: "no user with that email" }); // change to generic password
    }
    console.log("password", password, "hashedPW", user.password);
    const isValid = await bcrypt.compare(password, user.password);
    console.log("isValid", isValid);
    if (!isValid) {
      return res.status(400).json({ error: "password is wrong" }); // change to generic password
    }
    user.set("password", undefined);
    const token = generateToken(user._id.toString(), user.email);
    console.log(token);
    res.status(200).json({
      validated: true,
      token: token,
      user: user,
    });
  } catch (err) {
    handleError(err, res);
  }
};

export const getActiveUser = (req: Request, res: Response) => {
  res.status(200).json({ message: "token validated", user: req.user });
};

// const user = await UserModel.findOne({ email });
// if (!user) {
//   return res.status(400).json({ error: "Invalid credentials" }); //generic message
// }

// const isMatch = await comparePassword(password, user.password);
// if (!isMatch) {
//   return res.status(400).json({ error: "Invalid credentials" }); //generic message
//  }

// res.status(200).json({
//   user: {
//     email: user.email,
//     _id: user._id,
//   },
// });
// } catch (err) {
//   handleError(err, res);
//  }
// };

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json(users);
  } catch (error) {
    handleError(error, res);
  }
};
