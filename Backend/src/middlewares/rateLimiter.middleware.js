import { rateLimit } from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many registrations, Try again later",
});


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true, // tell user therelimits
  legacyHeaders: false, // previous header false unneccesary
  message: {
    message: "Too many login attempts, Try again in 15 minutes",
  },
});


export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {success: false, message: 'Too many requests'}
})