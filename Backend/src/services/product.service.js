import { productModel } from "../models/product.model.js";

export const getProductById = async (productId) => {
  const product = await productModel.findOne(
    {
      _id: productId,
      isActive: true,
    },
    {
      embeddingText: 0,
      embeddingUpdatedAt: 0,
    },
  );
  if (!product) {
    throw newError("Product Not Found");
  }

  const relatedProducts = await productModel.vectorSearch({
    queryVector: product.embedding,
    excludeId: product._id,
    limit: 5,
  });

  const productResponse = product.toObject();

  delete productResponse.embedding;

  if (!relatedProducts) {
    throw newError("No Related Products Found");
  }

  return { productResponse, relatedProducts };
};
