import "dotenv/config.js";
import express from "express";
export const authRouter = express.Router();
import * as authController from "../controllers/auth.controller.js";
import * as rateLimiter from "../middlewares/rateLimiter.middleware.js";
import * as validation from "../middlewares/validation.middleware.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

/**
 * @route /api/auth/register
 * @description Register a new user
 * @abstract Public
 */
authRouter.post(
  "/register",
  rateLimiter.registerLimiter,
  validation.registerValidation,
  validation.handleValidationErrors,
  authController.registerUserController,
);

/**
 * @route /api/auth/login
 * @description Login a new user
 * @abstract Public
 */
authRouter.post(
  "/login",
  rateLimiter.loginLimiter,
  validation.loginValidation,
  validation.handleValidationErrors,
  authController.loginUserController,
);

/**
 * @route /api/auth/logout
 * @description Logout a user
 * @abstract Public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route /api/auth/me
 * @description get current logged in user details
 * @abstract Public
 */
authRouter.get("/me", authMiddleware.authUser, authController.getMeController);
