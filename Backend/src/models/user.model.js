import mongoose from "mongoose";
import { type } from "node:os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already taken"],
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Account already exits with this email address"],
      required: true,
    },
    password: {
      type: String,
      validate: {
        validator: function () {
          return this.googleId || (this.password && this.password.lenght >= 8);
        },
        message: "Password is required for email signup",
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("users", userSchema);
