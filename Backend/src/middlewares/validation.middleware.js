import { body, param, validationResult } from "express-validator";


export const registerValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 100 })
    .withMessage("Email too long")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("username")
    .trim()
    .toLowerCase()
    .isLength({ max: 50 })
    .withMessage("Name too long")
    .notEmpty()
    .withMessage("Name is required"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain lowercase letters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 100 })
    .withMessage("Email too long")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

   body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

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

export const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product id"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("category").optional().trim().isLength({ min: 2 }),

  body("brand").optional().trim().isLength({ min: 2 }),

  body("price").optional().isFloat({ min: 0 }),

  body("stock").optional().isInt({ min: 0 }),

  body("tags").optional().isArray(),

  body("attributes").optional().isObject(),

  body("images").optional().isArray(),
];

export const deleteProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product Id"),
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
