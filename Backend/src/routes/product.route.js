import express from "express";
import { Router } from "express";
export const productRouter = Router();
import * as productController from "../controllers/product.controller.js";
import * as validationMiddleware from "../middlewares/validation.middleware.js";

/**
 * @route POST /api/products/
 * @description Route to post product by admin
 * @abstract private
 */
productRouter.post(
  "/",
  validationMiddleware.createProductValidation,
  productController.createProductController,
);


/**
 * @route GET /api/products/:id
 * @description Route to get product by id and its related products
 * @abstract private
 */
productRouter.get("/:id", productController.getProductByIdController);
