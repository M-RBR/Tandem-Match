import express from "express";
import cors from "cors";
import userRouter from "./routes/users";

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
