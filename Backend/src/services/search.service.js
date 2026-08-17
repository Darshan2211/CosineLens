import { getCache, setCache } from "./cache.service.js";
import { getEmbedding } from "./embeddings.service.js";
import { hybridSearch } from "./hybridSearch.service.js";

const SEARCH_CACHE_TTL = 300;

export const searchProduct = async (
  query,
  filters = {},
  // page = 1,
  limit = 10,
) => {
  const start = Date.now();

  const q = query.trim().toLowerCase();

  const cacheKey = `search:${q}:${JSON.stringify(filters)}:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return {
      ...cached,
      cached: true,
      responseTimeMs: Date.now() - start,
    };
  }

  const queryVector = await getEmbedding(q);

  const products = await hybridSearch(q, queryVector, filters, limit);

  const response = {
    query: q,
    // page: Number(page),
    limit: Number(limit),
    total: products.length,
    products,

  };

  await setCache(cacheKey, response, SEARCH_CACHE_TTL);

  return {
    ...response,
    cached: false,
    responseTimeMs: Date.now() - start,
  };
};
