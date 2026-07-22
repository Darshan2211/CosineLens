import { productModel } from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import { deleteCache } from "./cache.service.js";
import { getEmbedding } from "./embeddings.service.js";

/**
 * @description Service to get product by id and its related products
 */
export const getUserProductById = async (productId) => {
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
    throw new AppError("Product Not Found", 404);
  }

  const relatedProducts = await productModel.vectorSearch({
    queryVector: product.embedding,
    excludeId: product._id,
    limit: 5,
  });

  const productResponse = product.toObject();

  delete productResponse.embedding;

  if (!relatedProducts) {
    throw new AppError("No Related Products Found", 404);
  }

  return { productResponse, relatedProducts };
};

/**
 * @description Service to search product by admin query
 */
export const searchAdminProduct = async ({ query }) => {
  if (!query?.trim()) {
    throw new AppError("Search query is required, 400");
  }

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const products = await productModel
    .find({
      $or: [{ name: regex }, { brand: regex }, { category: regex }],
    })
    .select(
      "_id name brand category price stock images isActive createdAt updatedAt",
    )
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  return products;
};

/**
 * @description Service to get product by id for admin
 */
export const getAdminProductById = async (productId) => {
  const product = await productModel.findOne(
    { _id: productId, isActive: true },
    {
      embedding: 0,
      embeddingUpdatedAt: 0,
    },
  );

  if (!product) {
    throw new AppError("Product Not Found", 404);
  }

  return product;
};

/**
 * @description Service to create a new product and generate its embedding
 */
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

/**
 * @description Service to update a product and regenerate its embedding if necessary
 */
export const updateProduct = async ({ id, productData }) => {
  const ALLOWED_FIELDS = [
    "name",
    "description",
    "category",
    "brand",
    "price",
    "stock",
    "tags",
    "attributes",
    "images",
  ];

  const EMBEDDING_FIELDS = [
    "name",
    "description",
    "category",
    "brand",
    "tags",
    "attributes",
  ];

  const product = await productModel.findById(id);
  if (!product) {
    throw new AppError("Product Not Found", 404);
  }

  let shouldUpdateEmbedding = false;

  for (const field of ALLOWED_FIELDS) {
    if (field in productData) {
      product[field] = productData[field];
      if (EMBEDDING_FIELDS.includes(field)) {
        shouldUpdateEmbedding = true;
      }
    }
  }

  if (shouldUpdateEmbedding) {
    try {
      const embeddingText = product.buildEmbeddingText();
      const embedding = await getEmbedding(embeddingText);
      product.embedding = embedding;
      product.embeddingText = embeddingText;
      product.embeddingUpdatedAt = new Date();
    } catch (error) {
      throw new AppError(
        `Product updated but embedding failed : ${error.message}`,
        502,
      );
    }
  }

  await product.save();

  await Promise.allSettled([
    deleteCache(`related:${id}`),
    deleteCache("search:*"),
  ]);

  const updated = await productModel
    .findById(product._id)
    .select("-embedding -embeddingText -embeddingUpdatedAt")
    .lean();

  return updated;
};
