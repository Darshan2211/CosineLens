import { body, validationResult } from "express-validator";

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("brand").trim().notEmpty().withMessage("Brand is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock").isInt({ min: 0 }).withMessage("Stock cannot be negative"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("attributes").isObject().withMessage("Attributes must be an object"),

  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }
  next();
};


