import { getCache, setCache } from "./cache.service.js";
import { getEmbedding } from "./embeddings.service.js";
import { hybridSearch } from "./hybridSearch.service.js";

const SEARCH_CACHE_TTL = 300;

export const searchProduct = async (
  query,
  filters = {},
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

  const quembResult = await getEmbedding(q);
  const embeddedCached = quembResult.cached;
  const queryVector = quembResult.vector;

  const { keywordResults, vectorResults, hybridResults } = await hybridSearch(
    q,
    queryVector,
    filters,
    limit,
  );

  const response = {
    query: q,
    limit: Number(limit),

    embeddedCached,

    keywordResults,
    vectorResults,

    products: hybridResults,

    total: hybridResults.length,
  };

  await setCache(cacheKey, response, SEARCH_CACHE_TTL);

  return {
    ...response,
    cached: false,
    responseTimeMs: Date.now() - start,
  };
};
