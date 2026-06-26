import { redis } from "../config/redis";

/**
 * Retrievs value from redis cache
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export const getCache = async (key) => {
  return await redis.get(key);
};

/**
 * Set cache through services
 * @param {string} key
 * @param {*} value
 * @param {number} ttl in seconds
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, ttl) => {
  await redis.set(key, value, {
    ex: ttl,
  });
};

/**
 * Delete cache from redis
 * @param {string} key
 * @returns {Promise<void>}
 */
export const deleteCache = async (key) => {
  await redis.del(key);
};
