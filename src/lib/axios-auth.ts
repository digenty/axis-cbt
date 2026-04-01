/**
 * Authenticated Axios instance for the CBT app.
 *
 * Token resolution order (client-side):
 *   1. "cbt_token" cookie — JS-readable mirror written by /auth-entry
 *   2. "token" cookie     — the main app's httpOnly cookie (only readable
 *                           if CBT and main app share the same domain)
 *   3. localStorage "cbt-auth" — Zustand persist fallback (dev convenience)
 *
 * On 401: clears local copies and redirects to /auth-entry which will
 * bounce the user back to the main app's login.
 */
import axios from "axios";

export const BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

function readCookieValue(name: string): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(
		new RegExp(`(?:^|;\\s*)${name}=([^;]+)`),
	);
	if (!match) return null;
	try {
		return JSON.parse(decodeURIComponent(match[1]));
	} catch {
		return null;
	}
}

export function getToken(): string | null {
	// 1. JS-readable mirror written by /auth-entry
	const cbtToken = readCookieValue("cbt_token");
	console.log({ cbtToken });
	if (cbtToken) return cbtToken;

	// 2. Shared httpOnly cookie (same-domain deployments)
	const sharedToken = readCookieValue("token");
	console.log({ sharedToken });
	if (sharedToken) return sharedToken;

	// 3. Zustand localStorage fallback
	try {
		const raw = localStorage.getItem("cbt-auth");
		console.log({ raw });
		if (raw) {
			return (
				(JSON.parse(raw) as { state?: { token?: string } })?.state?.token ??
				null
			);
		}
	} catch {
		/* storage blocked in SSR or private mode */
	}

	return null;
}

const apiAuth = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

apiAuth.interceptors.request.use((config) => {
	const token = getToken();
	console.log({ token });
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

apiAuth.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401 && typeof window !== "undefined") {
			// Clear mirrors
			document.cookie = "cbt_token=; Max-Age=0; path=/";
			try {
				localStorage.removeItem("cbt-auth");
			} catch {
				/* ignore */
			}
			const returnTo = encodeURIComponent(window.location.pathname);
			window.location.href = `/auth-entry?returnTo=${returnTo}`;
		}
		return Promise.reject(error);
	},
);

export default apiAuth;
