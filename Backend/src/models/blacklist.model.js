import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required to add in blacklist"],
  },
});

export const tokenBlacklistModel = mongoose.model(
  "blacklistToken",
  blacklistTokenSchema,
);
