import axios from "axios";
import { clearStudentSession, getStudentSessionToken } from "./auth-session";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Unauthenticated — for the login endpoint
export const publicStudentApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Authenticated — for all student CBT endpoints
const studentApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

studentApi.interceptors.request.use(
  async (config) => {
    const { token } = await getStudentSessionToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

studentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearStudentSession();
    }
    return Promise.reject(error);
  },
);

export default studentApi;
