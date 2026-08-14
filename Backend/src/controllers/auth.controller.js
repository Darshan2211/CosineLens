import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import { tokenBlacklistModel } from "../models/blacklist.model.js";
import { productModel } from "../models/product.model.js";

/**
 * @name registerUserController,
 * @description Register a new user, expects username, email and password in req body
 * @access Public
 */
export const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      throw new AppError("Account already taken", 400);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    res.status(201).json({
      message: `${username} account created`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration Error", error);
    next(error);
  }
};

/**
 * @name loginUserController
 * @description Login a user, expects email and password in req body
 * @access public
 */
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      throw new AppError("Invali email or password", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid Password", 400);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Logged in Succesfully",

      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name logoutUserController
 * @description Logout user with token blacklisting and clear cookies
 * @access Public
 */
export const logoutUserController = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: "true",
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: `${username} Logged Out`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Public
 */
export const getMeController = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found (token invalid or deleted)", 404);
    }

    res.status(200).json({
      message: "user detail fetched succesfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name googleLoginController
 * @description login with Oauth of google
 * @access Public
 */
export const googleLoginController = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.direct(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    next(error);
  }
};
