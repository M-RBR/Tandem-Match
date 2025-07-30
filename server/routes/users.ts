import express from "express";
import multer from "multer";
import { getAllUsers, register, updateUser, login } from "../controllers/users";
// revise and add middlewares/jwt (jwAuth, testing Middlewares)

//  Multer Configuration (review later if necessary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder added to server side
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // Initialize Multer

const router = express.Router();

// Routes:

router.get("/test", (req, res) => {
  res.send("User routes are working");
});

// auth endpoints
router.post("/register", register);
router.post("/login", login);
// user endpoints

router.get("/", getAllUsers);
// router.get("/:search", getUserByUN);
router.post("/update/:_id", updateUser); // perhaps change to: router.post("/update", jwtAuth, updateUser);

router.post("/image", upload.single("image"), (req, res) => {
  // also 'upload.array possible' for multiple photos
  console.log(req.file);
  res.send("File successfully uploaded");
});

export default router;
