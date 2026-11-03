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
    // Only an invalid/expired token ends the session. A 403 means the token is
    // fine but this particular request isn't allowed for this user (e.g. an
    // admin-only endpoint called on a teacher-facing page) - that should fail
    // just that request, not force a logout.
    if (error.response?.status === 401) {
      deleteSession();
    }

    return Promise.reject(error);
  },
);

export default api;
