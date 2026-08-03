import express from "express";
export const productRouter = express.Router();
import * as productController from "../controllers/product.controller.js";
import * as validationMiddleware from "../middlewares/validation.middleware.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

/**
 * @route GET /api/products/admin/searchAdminProduct
 * @description Route to search product by admin query
 * @abstract private
 */
productRouter.get(
  "/admin/searchAdminProduct",
  authMiddleware.authUser,
  authMiddleware.authorize("admin"),
  productController.searchAdminProductController,
);

/**
 * @route GET /api/products/admin/getAdminProduct/:id
 * @description Route to get product by id for admin
 * @abstract private
 */
productRouter.get(
  authMiddleware.authUser,
  authMiddleware.authorize("admin"),
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
  authMiddleware.authUser,
  authMiddleware.authorize("admin"),
  validationMiddleware.createProductValidation,
  productController.createProductController,
);

/**
 * @route PUT /api/products/admin/update/:id
 * @description Route to update product by id
 * @abstract private
 */
productRouter.put(
  "/admin/:id/update",
  authMiddleware.authUser,
  authMiddleware.authorize("admin"),
  validationMiddleware.updateProductValidation,
  productController.updateProductController,
);

/**
 * @route PATCH /api/products/admin/:id/delete
 * @description Route to delete product by id
 * @abstract private
 */
productRouter.patch(
  "/admin/:id/delete",
  authMiddleware.authUser,
  authMiddleware.authorize("admin"),
  validationMiddleware.deleteProductValidation,
  productController.deleteProductController,
);

/**
 * USER
 * @route GET /api/products/:id
 * @description Route to get product by id and its related products
 * @abstract Public
 */
productRouter.get("/:id", productController.getProductByIdController);
