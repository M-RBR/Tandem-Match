import express from "express";
import multer from "multer";
import {
  getAllUsers,
  register,
  updateUser,
  login,
  getActiveUser,
} from "../controllers/users";
import { verifyToken } from "../middlewares/authMiddleware";
import { jwtAuth } from "../middlewares/jwt";
import { handleMulterResponse } from "../middlewares/multer";
import { imageUpload } from "../utils/imageManagement";
import { handleError } from "../utils/errorHandling";

//  Multer Configuration (review later if necessary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // revise: deleted folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // Initialize Multer

const router = express.Router();

// Test route (public)
router.get("/test", (req, res) => {
  res.send("User routes are working");
});

// Auth routes / endpoints (public)
router.post("/register", register);
router.post("/login", login);
router.get("/me", jwtAuth, getActiveUser);

// Protected routes (requires valid JWT)
router.get("/", verifyToken, getAllUsers); // change verifyToken to jwtAuth?
// router.get("/:search", getUserByUN)
router.post(
  "/update/:_id",
  verifyToken,
  upload.single("image"),
  handleMulterResponse,
  updateUser
); // change verifyToken to jwtAuth?

/*

router.post(
  "/image",
  jwtAuth,
  upload.single("image"),
  handleMulterResponse,
  async (req, res) => {
    try {
      console.log(req.file);
      if (req.file) {
        const result = await imageUpload(
          req.file,
          "MERN-project/user_profiles"
        );
        console.log(result);
      }
      res.send("image testing endpoint");
    } catch (error) {
      console.log(error);
      handleError(error, res);
    }
  }
);

*/

export default router;

// Upload route (protect at later point?)
//router.post("/image", upload.single("image"), (req, res) => {
//   console.log(req.file);
//  res.send("File successfully uploaded");
// });

/* protect image upload later:

router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("File successfully uploaded");
});

*/
