import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, default: "Anon" }, // user can exist without a username, maybe change later, sync with frontend
    password: { type: String, required: true },
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
