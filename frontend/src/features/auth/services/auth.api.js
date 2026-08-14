import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}
