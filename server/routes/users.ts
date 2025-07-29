import express from "express";
import { getAllUsers, register, updateUser, login } from "../controllers/users";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("User routes are working");
});

router.get("/", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/update/:_id", updateUser);

export default router;
