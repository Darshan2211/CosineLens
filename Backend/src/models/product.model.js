import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    signals: {
      clicks: {
        type: Number,
        default: 0,
      },
      cartAdds: {
        type: Number,
        default: 0,
      },
      purchases: {
        type: Number,
        default: 0,
      },
      impressions: {
        type: Number,
        default: 0,
      },
    },

    embedding: {
      type: [Number],
      default: undefined,
    },
    embeddingText: {
      type: String,
      default: undefined,
    },
    embeddingUpdatedAt: {
      type: Date,
      defaule: undefined,
    },
  },
  { timestamps: true },
);

// INDEXES for DB
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ "signal.purchases": -1 });
productSchema.index({ category: 1, isActive: 1, price: 1 });

/***
 * Build embedding text method
 *
 * Creates the text embedding to generate the embeddings
 *
 * It converts into single searchable string
 *
 * @returns {string}
 */
productSchema.methods.buildEmbeddingText = function () {
  const attributeText = Object.entries(this.attributes)
    .map(([key, value]) => `${key} : ${value}`)
    .join(". ");

  return [
    this.name,
    this.description,
    this.category,
    this.brand,
    this.tags?.join(", "),
    attributeText,
  ]
    .filter(Boolean)
    .join(". ");
};

/**
 * Static : Vector Search Method
 *
 * Performs semantic product search using
 * MongoDB Atlas Vector Search
 *
 * Similar to user query embedding.
 *
 * @param {number[]} queryVector
 * Query embedding generated for user text query
 *
 * @param {object} filters
 * Optional search filters
 *
 * @param {number} limit
 * Maximum number of product to return
 *
 * @returns {Promise<Array>}
 *
 */
productSchema.statics.vectorSearch = async function (
  queryVector,
  filters = {},
  limit = 20,
) {
  const pipeline = [
    // Stage 1 - vector similarity search
    {
      $vectorSearch: {
        index: "product_vector_index",
        path: "embedding",
        queryVector: "queryVector",
        numCandidates: "limit * 5",
        limit: limit,
        ...(buildVectorFilter(filters) && {
          filter: buildVectorFilter(filters),
        }),
      },
    },

    // Stage 2 - cosine similarity score
    {
      $addFields: {
        vectorScore: { $meta: "vectorSearchScore" },
      },
    },

    // Stage 3 - remove inactive and low match products
    {
      $match: {
        vectorScore: { $gte: 0.5 },
        isActive: true,
      },
    },

    // Stage 4 - final response
    {
      $project: {
        name: 1,
        description: 1,
        category: 1,
        brand: 1,
        price: 1,
        tags: 1,
        attributes: 1,
        stock: 1,
        images: 1,
        rating: 1,
        reviewCount: 1,
        signals: 1,
        vectorScore: 1,

        embedding: 0,
        embeddingText: 0,
        embeddingUpdatedAt: 0,
      },
    },
  ];
  return this.aggregate(pipeline);
};

/**
 * Static : Keyword Search Method
 *
 * Performs keyword product search using
 * MongoDB Atlas Keyword Search
 *
 * Search product on basis of user query
 *
 * @param {string} query
 * User query search
 *
 * @param {object} filters
 * Optional Search filters
 *
 * @param {number} limit
 * Maximum number of product to return
 */
productSchema.statics.keywordSearch = async function (
  query,
  filters = {},
  limit = 20,
) {
  const pipeline = [
    //Stage 1 - Keyword similarity search
    {
      $search: {
        index: "product_text_index",
        compound: {
          should: [
            {
              text: {
                query: query,
                path: ["name", "description", "brand", "tags"],
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 2 } },
              },
            },
          ],
        },
      },
    },

    // Stage 2 - Search score

    {
      $addFields: {
        textScore: { $meta: "searchScore" },
      },
    },

    // Stage 3 - isActive products to match
    {
      $match: {
        $isActive: true,
      },
    },

    {
      $limit: limit,
    },

    // Stage 4 - Final response
    {
      $project: {
        name: 1,
        description: 1,
        category: 1,
        brand: 1,
        price: 1,
        tags: 1,
        attributes: 1,
        stock: 1,
        images: 1,
        rating: 1,
        reviewCount: 1,
        signals: 1,
        textScore: 1,
        embedding: 0,
      },
    },
  ];
  return this.aggregate(pipeline);
};

/**
 * Build mongodb atlas vector filters
 * for user selected filters
 *
 * Filters :
 *
 * -Brand, minPrice, maxPrice, inStock
 *
 * @param {object} filters
 * @param {string} [filters.brand]
 * @param {number} [filter.minPrice]
 * @param {number} [filter.maxPrice]
 * @param {boolean} [filters.inStock]
 * @returns {object|null}
 */
const buildVectorFilter = ({ brand, minPrice, maxPrice, inStock }) => {
  const conditions = [];

  if (brand) {
    conditions.push({ equals: { path: "brand", value: brand } });
  }

  if (inStock) {
    conditions.push({ range: { path: "stock", gte: 1 } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    conditions.push({
      range: {
        path: "price",
        ...(minPrice !== undefined && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { gte: Number(maxPrice) }),
      },
    });
  }
  return conditions.length > 0 ? { compound: { must: conditions } } : null;
};

export const productModel = mongoose.model("product", productSchema);


