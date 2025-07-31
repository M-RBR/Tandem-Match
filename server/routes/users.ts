import express from "express";
import multer from "multer";
import { getAllUsers, register, updateUser, login } from "../controllers/users";
import { verifyToken } from "../middlewares/authMiddleware";

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

// Auth routes (public)
router.post("/register", register);
router.post("/login", login);

// Protected routes (requires valid JWT)
router.get("/", verifyToken, getAllUsers);
router.post("/update/:_id", verifyToken, updateUser);

// Upload route (protect at later point?)
router.post("/image", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("File successfully uploaded");
});

export default router;

/* protect image upload:

router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("File successfully uploaded");
});

*/
