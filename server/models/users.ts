/*

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
    },
    password: { type: String, required: true },
    // profiale: profileSchema,
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;

*/

import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String },
    dob_day: { type: String }, // now stored as ISO string, perhaps chage to 'Date type'?
    gender_identity: { type: String, enum: ["man", "woman", "diverse"] },
    gender_interest: { type: String, enum: ["men", "women", "everyone"] },
    about: { type: String },
    image: { type: String },
    spoken_languages: [languageSchema],
    learning_languages: [languageSchema],
    // matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // expant this later
  },
  { timestamps: true, collection: "users" }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
