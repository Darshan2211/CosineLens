import { getProductById } from "../services/product.service.js";

export const getProductByIdController = async (req, res, next) => {
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
