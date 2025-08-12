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
  addMatch,
  getMatches,
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
router.get("/matches", jwtAuth, getMatches); // NEW ROUTE

// profile update route
router.post(
  "/update/:_id",
  jwtAuth,
  upload.single("image"),
  handleMulterResponse,
  updateUser
);

// NEW: routes for liking and disliking profiles !!!!

router.post("/add-like", jwtAuth, addLike);
router.post("/add-dislike", jwtAuth, addDislike);

// route for liking/matching // CHECK IF STILL NEEDED
// router.post("/add-match", jwtAuth, addMatch);

export default router;
