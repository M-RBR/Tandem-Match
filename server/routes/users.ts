import express from "express";
// import multer from "multer";
import {
  getAllUsers,
  register,
  updateUser,
  login,
  getActiveUser,
  addDislike,
  addLike,
  getMatches,
  getUserById,
} from "../controllers/users";
import { jwtAuth } from "../middlewares/jwt";
import { upload, handleMulterResponse } from "../middlewares/multer";
// import { imageUpload } from "../utils/imageManagement";
// import { handleError } from "../utils/errorHandling";

const router = express.Router();

// test route
router.get("/test", (req, res) => {
  res.send("User routes are working");
});

// auth routes
router.post("/register", register);
router.post("/login", login);

// get routes
router.get("/me", jwtAuth, getActiveUser);
router.get("/", jwtAuth, getAllUsers);
router.get("/matches", jwtAuth, getMatches);
router.get("/:id", jwtAuth, getUserById);

// profile update route
router.post(
  "/update/:_id",
  jwtAuth,
  upload.single("image"),
  handleMulterResponse,
  updateUser
);

// routes for liking/disliking profiles

router.post("/add-like", jwtAuth, addLike);
router.post("/add-dislike", jwtAuth, addDislike);

export default router;
