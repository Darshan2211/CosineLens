import express from "express";
import { Router } from "express";
export const searchRouter = Router();
import * as searchController from "../controllers/search.controller.js";

/**
 * @route GET /api/search
 * @description Searches products using hybrid semantic and keyword search
 * @abstract private
 */
searchRouter.get("/", searchController.search);

/**
 * @route GET /api/search/autocomplete
 * @description Searches the autocomplete for the query
 * @abstract private
 */
searchRouter.get("/autocomplete", searchController.autocomplete);
