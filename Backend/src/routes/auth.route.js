import "dotenv/config.js";
import express from "express";
export const authRouter = express.Router();
import * as authController from "../controllers/auth.controller.js";
import * as rateLimiter from "../middlewares/rateLimiter.middleware.js";
import * as validation from "../middlewares/validation.middleware.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import passport from "passport";

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

/**
 * @route GET /api/auth/google
 * @description starts Oauth process redirect to google
 * @access Public
 */
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @route GET /api/auth/google/callback
 * @description login the user with google
 * @access Public
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  authController.googleLoginController,
);
