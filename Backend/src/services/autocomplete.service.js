import { productModel } from "../models/product.model.js";
import { getCache, setCache } from "../services/cache.service.js";

const AUTOCOMPLETE_TTL = 60 * 30;

export const getAutocompleteSuggestions = async (query) => {
  const q = query?.trim();
  if (!q || q.length < 2) {
    return [];
  }

  const cacheKey = `autocomplete:${q.toLowerCase()}`;

  const cachedSuggestions = await getCache(cacheKey);

  if (cachedSuggestions) {
    return cachedSuggestions;
  }

  const suggestions = await productModel.autocomplete(q);

  await setCache(cacheKey, suggestions, AUTOCOMPLETE_TTL);

  return suggestions;
};
