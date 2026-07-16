import mongoose from "mongoose";

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
  limit = 10,
) {
  const filter = buildVectorFilter(filters);

  const pipeline = [
    // Stage 1 - vector similarity search

    {
      $vectorSearch: {
        index: "product_vector_index",
        path: "embedding",
        queryVector: queryVector,
        numCandidates: limit * 5,
        limit: limit,
        filter,
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
        // vectorScore: { $gte: 0.5 },
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
  limit = 10,
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
      $match: buildMatchFilter(filters),
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
      },
    },
  ];
  return this.aggregate(pipeline);
};

/**
 * Static : Autocomplete Search Method
 *
 * Matches the search product and suggest it
 * MongoDB Atlas autcomplete index
 *
 * Suggest product on basis of search
 *
 * @param {string} query
 * user query search
 *
 * @param {number} limit
 * Maximum number of product to return
 *
 */
productSchema.statics.autocomplete = async function (query, limit = 10) {
  const pipeline = [
    {
      $search: {
        index: "product_autocomplete_index",
        compound: {
          filter: {
            equals: {
              path: "isActive",
              value: true,
            },
          },
          should: [
            {
              autocomplete: {
                query,
                path: "name",
                fuzzy: { maxEdits: 1, prefixLength: 2 },
                score: { boost: { value: 5 } },
              },
            },
            {
              autocomplete: {
                query,
                path: "brand",
                fuzzy: { maxEdits: 1, prefixLength: 2 },
                score: { boost: { value: 5 } },
              },
            },
            {
              autocomplete: {
                query,
                path: "category",
                fuzzy: { maxEdits: 1, prefixLength: 2 },
                score: { boost: { value: 5 } },
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },

    {
      $addFields: {
        score: { $meta: "searchScore" },
      },
    },

    {
      $group: {
        _id: "$name",
        score: { $first: "$score" },
        brand: { $first: "$brand" },
        category: { $first: "$category" },
      },
    },

    {
      $sort: { score: -1 },
    },

    {
      $limit: limit,
    },

    {
      $project: {
        _id: 0,
        suggestion: "$_id",
        brand: 1,
        category: 1,
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
  const filter = {
    isActive: { $eq: true },
  };

  if (brand) {
    filter.brand = { $eq: brand };
  }

  if (inStock) {
    filter.stock = { $gte: 1 };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  return filter;
};

/**
 * Build keyword ilter
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
const buildMatchFilter = ({ brand, minPrice, maxPrice, inStock } = {}) => {
  const match = {
    isActive: true,
  };

  if (brand) {
    match.brand = brand;
  }
  if (inStock) {
    match.stock = {
      $gte: 1,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    match.price = {};
    if (minPrice !== undefined) {
      match.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      match.price.$lte = Number(maxPrice);
    }
  }
  return match;
};

export const productModel = mongoose.model("product", productSchema);
