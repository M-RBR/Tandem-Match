import express from "express";
import cors from "cors";
import userRouter from "./routes/users";
import "dotenv/config";
import mongoose from "mongoose";
import { testingMiddleware } from "./middlewares/jwt";
import configureCloudinary from "./config/cloudinary";

// console.log(process.env.MAXIM);

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// image upload

app.use(cors());
configureCloudinary();
// app.use("/", express.static("documentation")); // why is this here?
app.use("/images", express.static("uploads")); // change this to not have local upload?
app.use(testingMiddleware);

// Added, revise later; use baseURL?
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.post("/testing", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);

app.use("/*splat", (req, res) =>
  res.status(404).json({ error: "Endpoint not found." })
);

if (!process.env.MONGO_URI) {
  throw new Error("no mongo uri");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(
        "Connection to MongoDB established, and server is running on http://localhost: " +
          port
      );
    });
  })
  .catch((err) => console.log(err));
