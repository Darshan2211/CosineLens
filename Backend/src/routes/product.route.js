import express from "express";
import { Router } from "express";
export const productRouter = Router();
import * as productController from "../controllers/product.controller.js";

productRouter.get("/:id", productController.getProductByIdController);
