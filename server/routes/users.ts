import express from "express";
import multer from "multer";
import {
  getAllUsers,
  register,
  updateUser,
  login,
  getActiveUser,
} from "../controllers/users";
import { jwtAuth } from "../middlewares/jwt";
import { upload, handleMulterResponse } from "../middlewares/multer";
// import { imageUpload } from "../utils/imageManagement";
// import { handleError } from "../utils/errorHandling";

const router = express.Router();

// test route (public)
router.get("/test", (req, res) => {
  res.send("User routes are working");
});

// auth routes / endpoints (public)
router.post("/register", register);
router.post("/login", login);

// get active user (requires token)
router.get("/me", jwtAuth, getActiveUser);

// protected routes (requires valid JWT)
router.get("/", jwtAuth, getAllUsers);

// router.get("/:search", getUserByUN)
router.post(
  "/update/:_id",
  jwtAuth,
  upload.single("image"),
  handleMulterResponse,
  updateUser
);
export default router;
