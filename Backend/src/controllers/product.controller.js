import {
  createProduct,
  getUserProductById,
  updateProduct,
  searchAdminProduct,
  getAdminProductById,
} from "../services/product.service.js";

/**
 * @description Controller to get product by id and its related products
 */
export const getProductByIdController = async (req, res) => {
  try {
    const product = await getUserProductById(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Product Id error", error);
    res.status(500).json({ message: "Product not Found" });
  }
};


/**
 * @description Controller to search product by admin query
 */
export const searchAdminProductController = async (req, res) => {
  try {
    const product = await searchAdminProduct(req.query);

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Product Id error", error);
    res.status(500).json({ message: "Product not Found" });
  }
};

/**
 * @description Controller to get product by id for admin
 */
export const getAdminProductController = async (req, res) => {
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
 * @description Controller to create product by admin and automatic embedding generation
 */
export const createProductController = async (req, res) => {
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
    console.error("Product Creation Error", error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/**
 * @description Controller to update product by admin
 */
export const updateProductController = async (req, res) => {
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
    console.error("Prouduct Update Failed", error);
    res.status(500).json({ message: "Product Update Failed" });
  }
};
