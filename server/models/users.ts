import mongoose from "mongoose";

// const profileSchema = new mongoose.Schema({
//   birthdate: String,
//   image: String,
// });

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dvs3spmfg/image/upload/v1754242465/placeholder_profile_nqusxp.png",
    },
    password: { type: String, required: true },
    // profiale: profileSchema,
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
