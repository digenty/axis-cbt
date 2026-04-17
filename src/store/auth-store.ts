/**
 * Thin auth store used by the CBT app.
 * Persisted to localStorage under the key "cbt-auth" so the Axios interceptor
 * can read it as a last-resort fallback when cookies aren't accessible.
 *
 * The primary auth mechanism is always the shared cookie from the main app.
 * This store is only needed in dev (different ports) or as a belt-and-suspenders
 * for client-side token access.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    { name: "cbt-auth" },
  ),
);
