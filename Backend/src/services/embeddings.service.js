import crypto, { hash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { getCache, setCache } from "./cache.service.js";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

const EMBEDDING_TTL = 86400;

/**
 * Retrieves a cached embedding or generate a new
 * embedding using Gemini Embeddings API.
 *
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const getEmbedding = async (text) => {
  const normalised = text.trim().toLowerCase().slice(0, 500);
  const hash = crypto.createHash("md5").update(normalised).digest("hex");

  const cacheKey = `emb${hash}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return {
      vector: cached,
      cached: true,
    };
  }

  let vector;
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: normalised,
      encoding_format: "float",
      config: { outputDimensionality: 1536 },
    });

    vector = response.embeddings[0].values;
  } catch (error) {
    if (error.status === 429) throw new Error("Gemini rate limit hit");
    if (error.status === 401) throw new Error("Gemini key is invalid");
    throw new Error(`Embedding Failed: ${error.message}`);
  }

  await setCache(cacheKey, vector, EMBEDDING_TTL);

  return {
    vector,
    cached: false,
  };
};
