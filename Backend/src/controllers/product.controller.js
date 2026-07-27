import {
  createProduct,
  getUserProductById,
  updateProduct,
  searchAdminProduct,
  getAdminProductById,
  deleteProduct,
} from "../services/product.service.js";

/**
 * @name getProductByIdController
 * @description Controller to get product by id and its related products
 */
export const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getUserProductById(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name searchAdminProductController
 * @description Controller to search product by admin query
 */
export const searchAdminProductController = async (req, res, next) => {
  try {
    const product = await searchAdminProduct(req.query);

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name getAdminProductController
 * @description Controller to get product by id for admin
 */
export const getAdminProductController = async (req, res, next) => {
  try {
    const product = await getAdminProductById(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name createProductController
 * @description Controller to create product by admin and automatic embedding generation
 */
export const createProductController = async (req, res, next) => {
  const {
    name,
    description,
    category,
    brand,
    price,
    stock,
    tags,
    attributes,
    images,
  } = req.body;
  try {
    const newProduct = await createProduct(req.body);

    res.status(200).json({
      newProduct,
      message: "Product Created Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name updateProductController
 * @description Controller to update product by admin
 */
export const updateProductController = async (req, res, next) => {
  try {
    const updatedProduct = await updateProduct({
      id: req.params.id,
      productData: req.body,
    });

    return res.status(200).json({
      sucess: true,
      updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @name deleteProductController
 * @description Controller to delete product by admin
 */
export const deleteProductController = async (req, res, next) => {
  try {
    const deletedProduct = await deleteProduct({ id: req.params.id });

    return res.status(200).json({
      success: true,
      deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};
