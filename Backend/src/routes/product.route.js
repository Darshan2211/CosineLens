import express from "express";
import { Router } from "express";
export const productRouter = Router();
import * as productController from "../controllers/product.controller.js";
import * as validationMiddleware from "../middlewares/validation.middleware.js";

/**
 * @route GET /api/products/admin/searchAdminProduct
 * @description Route to search product by admin query
 * @abstract private
 */
productRouter.get(
  "/admin/searchAdminProduct",
  productController.searchAdminProductController,
);

/**
 * @route GET /api/products/admin/getAdminProduct/:id
 * @description Route to get product by id for admin
 * @abstract private
 */
productRouter.get(
  "/admin/getAdminProduct/:id",
  productController.getAdminProductController,
);

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
 * @route PUT /api/products/admin/update/:id
 * @description Route to update product by id
 * @abstract private
 */
productRouter.put(
  "/admin/update/:id",
  validationMiddleware.updateProductValidation,
  productController.updateProductController,
);

/**
 * USER
 * @route GET /api/products/:id
 * @description Route to get product by id and its related products
 * @abstract private
 */
productRouter.get("/:id", productController.getProductByIdController);
