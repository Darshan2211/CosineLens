import "dotenv/config.js";
import express from "express";
export const authRouter = express.Router();
import * as authController from "../controllers/auth.controller.js";
import * as rateLimiter from "../middlewares/rateLimiter.middleware.js";
import * as validation from "../middlewares/validation.middleware.js";

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

authRouter.post(
  "/login",
  rateLimiter.loginLimiter,
  validation.loginValidation,
  validation.handleValidationErrors,
  authController.loginUserConroller,
);
