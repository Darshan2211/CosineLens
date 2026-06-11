const mongoose = require("mongoose");
const { type } = require("node:os");

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

// Building text for Embedding generation
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

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
