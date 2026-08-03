import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model.js";
import AppError from "../utils/AppError.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Authentication Required", 401);
  }

  try {
    const isTokenBlackListed = await tokenBlacklistModel.findOne({ token });

    if (isTokenBlackListed) {
      throw new AppError("Invalid Password", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not Authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role "${req.user.role}" is not allowed ot access this route`,
        ),
      );
    }
  };

  next();
};
