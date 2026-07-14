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
