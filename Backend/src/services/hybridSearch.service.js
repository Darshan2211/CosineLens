import { productModel } from "../models/product.model.js";

const RRF_K = 60;

/**
 * Executtes a hybrid search by combining semantic
 * vector search and keyword search using
 * Reciprocal Rank Fusion
 *
 * If one search fails, results from the other
 * search are still returned
 *
 * @param {string} query
 * @param {number[]} queryVector
 * @param {object} filters
 * @param {number} limit
 * @returns {Promise<Object[]>}
 * Ranked list of products with hybrid relevance scores
 */

export const hybridSearch = async (
  query,
  queryVector,
  filters = {},
  limit = 10,
) => {
  const [vectorSettled, keywordSettled] = await Promise.allSettled([
    productModel.vectorSearch(queryVector, filters, limit),
    productModel.keywordSearch(query, filters, limit),
  ]);

  const vectorResults =
    vectorSettled.status === "fulfilled" ? vectorSettled.value : [];
  const keywordResults =
    keywordSettled.status === "fulfilled" ? keywordSettled.value : [];

  if (vectorSettled.status === "rejected") {
    console.error("vectorSearch Failed", vectorSettled.reason?.message);
  }

  if (keywordSettled.status === "rejected") {
    console.error("keywordSearch Failed", keywordSettled.reason?.message);
  }

  if (!vectorResults.length && !keywordResults.length) return [];

  const scores = {};
  const docs = {};

  const applyRRF = (results) => {
    results.forEach((product, index) => {
      const id = product._id.toString();
      docs[id] ??= product;
      scores[id] = (scores[id] ?? 0) + 1 / (RRF_K + index + 1);
    });
  };

  applyRRF(vectorResults);
  applyRRF(keywordResults);

  const vectorIds = new Set(vectorResults.map((p) => p._id.toString()));
  const keywordIds = new Set(keywordResults.map((p) => p._id.toString()));

  return Object.keys(scores)
    .map((id) => ({
      ...docs[id],
      hybridScore: Number(scores[id].toFixed(6)),
      source:
        vectorIds.has(id) && keywordIds.has(id)
          ? "both"
          : vectorIds.has(id)
            ? "vector"
            : "keyword",
    }))
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, limit);
};
