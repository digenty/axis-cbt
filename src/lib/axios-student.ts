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
    // Only an invalid/expired token ends the session. A 403 means the token is
    // fine but this particular request isn't allowed right now (e.g. the
    // assessment window is closed) - that should fail just that request, not
    // force a logout.
    if (error.response?.status === 401) {
      clearStudentSession();
    }
    return Promise.reject(error);
  },
);

export default studentApi;
