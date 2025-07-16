import express from "express";

const userRouter = express.Router();

userRouter.get("/test", (req, res) => {
  res.send("testing route....");
});

export default userRouter;
