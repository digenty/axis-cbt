/**
 * /auth-entry — CBT Auth Bridge Page
 *
 * This server page handles two scenarios:
 *
 * SCENARIO A — Token passed in URL query param (cross-subdomain dev / CI)
 *   The main app can redirect to: /auth-entry?token=<JWT>&returnTo=/subjects
 *   This page writes the token to a JS-readable cookie and redirects to returnTo.
 *
 * SCENARIO B — Middleware already confirmed the shared httpOnly "token" cookie
 *   exists but for some reason the client page shows 404 / auth error.
 *   Navigating to /auth-entry bootstraps the cbt_token mirror and redirects home.
 *
 * SCENARIO C — No token found anywhere
 *   Redirect to the main app login.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MAIN_APP_URL =
	process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:8000";
const MAIN_APP_LOGIN_PATH =
	process.env.NEXT_PUBLIC_MAIN_APP_LOGIN_PATH ?? "/auth/staff";

interface Props {
	searchParams: Promise<{ token?: string; returnTo?: string }>;
}

export default async function AuthEntryPage({ searchParams }: Props) {
	const params = await searchParams;
	const returnTo = params.returnTo ?? "/subjects";
	const cookieStore = await cookies();

	// ── Scenario A: token passed explicitly in the URL ──────────────────────────
	if (params.token) {
		const tokenValue = JSON.stringify(params.token);

		// Write the httpOnly cookie (mirrors the main app's cookie exactly)
		cookieStore.set("token", tokenValue, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 8,
			secure: process.env.NODE_ENV === "production",
		});

		// Also write a JS-readable mirror for the client-side Axios interceptor
		cookieStore.set("cbt_token", tokenValue, {
			httpOnly: false,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 8,
			secure: process.env.NODE_ENV === "production",
		});

		redirect(returnTo);
	}

	// ── Scenario B: httpOnly "token" cookie already present ─────────────────────
	const existingToken = cookieStore.get("token")?.value;
	if (existingToken) {
		// Mirror to a JS-readable cookie for the Axios interceptor
		cookieStore.set("cbt_token", existingToken, {
			httpOnly: false,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 8,
			secure: process.env.NODE_ENV === "production",
		});
		redirect(returnTo);
	}

	// ── Scenario C: no token anywhere → send back to main app login ──────────────
	redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
}
