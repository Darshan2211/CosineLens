require("dotenv").config();
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const productModel = require("../models/product.model");

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

async function generateEmbedding() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Embedding DB connection\n");

    const products = await productModel
      .find({
        embedding: { $exists: false },
        isActive: true,
      })
      .limit(25);

    console.log(products);

    if (products.length === 0) {
      console.log("All product have embeddings, Nothing to change");
      return mongoose.disconnect();
    }

    try {
      console.log("Started emebedding");
      for (const product of products) {
        const text = product.buildEmbeddingText();

        const response = await ai.models.embedContent({
          model: "gemini-embedding-2",
          contents: text,
          encoding_format: "float",
          config: { outputDimensionality: 1536 },
        });

        const vector = response.embeddings[0].values;

        console.log(vector);

        await productModel.findByIdAndUpdate(product._id, {
          $set: {
            embedding: vector,
            embeddingText: text,
            embeddingUpdatedAt: new Date(),
          },
        });
      }
      console.log("Embeddings generated succesfully and stored in db");
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = generateEmbedding;
