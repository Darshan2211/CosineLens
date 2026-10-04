import { searchProduct } from "../services/search.service.js";
import { getAutocompleteSuggestions } from "../services/autocomplete.service.js";

/**
 * @name search
 * @description Handles product search requests and returns ranked search results
 * @access Public
 */
export const search = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, inStock } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const brand =
      typeof req.query.brand === "string" && req.query.brand.trim()
        ? req.query.brand.trim()
        : undefined;

    const filters = {
      brand: brand || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock !== undefined ? inStock === "true" : undefined,
    };

    const result = await searchProduct(q.trim(), filters, limit); //page

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Search is temporarily unvavailable.Please try again later.",
      });
  }
};

/**
 * @name autocomplete
 * @description Handles autocomplete suggestion and return the suggested products on query
 * @access Public
 */
export const autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;

    const suggestions = await getAutocompleteSuggestions(q);

    console.log(suggestions);

    res.status(200).json({
      success: true,
      total: suggestions.length,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};
