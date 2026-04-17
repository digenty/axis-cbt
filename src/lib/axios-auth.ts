import axios from "axios";
import { deleteSession, getSessionToken } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * - Attach auth token
 */
api.interceptors.request.use(
  async (config) => {
    const { token } = await getSessionToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor
 * - Centralized error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Unauthorized
      // await redirect("/auth");
      deleteSession();
    }

    return Promise.reject(error);
  },
);

export default api;
