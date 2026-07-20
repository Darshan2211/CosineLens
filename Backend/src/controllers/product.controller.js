import { createProduct, getProductById } from "../services/product.service.js";

/**
 *
 * @description Controller to get product by id and its related products
 */
export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Product Id error", error);
    res.status(500).json({ message: "Product not Found" });
  }
};

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
