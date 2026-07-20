import { productModel } from "../models/product.model.js";
import { getEmbedding } from "./embeddings.service.js";

/**
 * @description Service to get product by id and its related products
 */
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

export const createProduct = async (productData) => {
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
  } = productData;

  const newProduct = new productModel({
    name: name,
    description: description,
    category: category,
    brand: brand,
    price: price,
    stock: stock,
    tags: tags,
    attributes: attributes,
    images: images,
  });

  const embeddingText = await newProduct.buildEmbeddingText({
    name,
    description,
    category,
    brand,
    tags,
    attributes,
  });

  const embedding = await getEmbedding(embeddingText);

  newProduct.embedding = embedding;
  newProduct.embeddingText = embeddingText;
  newProduct.embeddingUpdatedAt = new Date();

  await newProduct.save();

  return newProduct;
};

