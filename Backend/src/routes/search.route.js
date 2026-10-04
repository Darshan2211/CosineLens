import express from "express";
export const searchRouter = express.Router();
import * as searchController from "../controllers/search.controller.js";
import * as rateLimiter from "../middlewares/rateLimiter.middleware.js";

/**
 * @route GET /api/search
 * @description Searches products using hybrid semantic and keyword search
 * @abstract Public
 */
searchRouter.get("/", rateLimiter.searchLimiter, searchController.search);

/**
 * @route GET /api/search/autocomplete
 * @description Searches the autocomplete for the query
 * @abstract Public
 */
searchRouter.get("/autocomplete", searchController.autocomplete);
