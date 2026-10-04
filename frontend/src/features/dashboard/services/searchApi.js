import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/search`,
  withCredentials: true,
});

export const search = async ({
  query,
  brand,
  minPrice,
  maxPrice,
  limit = 10,
  inStock,
}) => {
  const response = await api.get("/", {
    params: {
      q: query,
      brand,
      minPrice,
      maxPrice,
      inStock,
      limit,
    },
  });
  return response.data;
};


