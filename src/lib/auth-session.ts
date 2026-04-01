"use server";

/**
 * CBT-side session helpers.
 *
 * The main app writes an httpOnly cookie called "token" (a JSON-stringified JWT).
 * This file exposes server actions the CBT can use to:
 *   - Read that token on the server side
 *   - Redirect to the main app login when the token is absent / expired
 *   - Bootstrap a short-lived non-httpOnly copy so client Axios can attach it
 *     (only needed when CBT runs on a different subdomain than the main app)
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** URL of the main app — used for cross-origin redirects */
const MAIN_APP_URL =
	process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";
const MAIN_APP_LOGIN_PATH =
	process.env.NEXT_PUBLIC_MAIN_APP_LOGIN_PATH ?? "/auth/staff";

// ─── Read the JWT from the shared httpOnly cookie ─────────────────────────────
export async function getSessionToken(): Promise<{ token: string }> {
	const cookieStore = await cookies();
	const raw = cookieStore.get("token")?.value;

	if (!raw) {
		redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
	}

	try {
		const token = JSON.parse(raw!) as string;
		return { token };
	} catch {
		redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
	}
}

// ─── Optionally expose the token as a readable (non-httpOnly) cookie ──────────
//
// Call this once from the /auth-entry route handler when the CBT runs on a
// different subdomain and client-side Axios can't read the main app's httpOnly
// cookie directly.  We write a mirrored cookie that is readable by JS but
// scoped to the CBT subdomain only.
//
export async function bootstrapClientToken(): Promise<void> {
	const cookieStore = await cookies();
	const raw = cookieStore.get("token")?.value;
	if (!raw) return;

	// Write a JS-readable mirror so the client Axios interceptor can pick it up
	cookieStore.set("cbt_token", raw, {
		httpOnly: false, // intentionally readable by client JS
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 8, // 8 hours
		secure: process.env.NODE_ENV === "production",
	});
}

// ─── Delete CBT-side token cookies and redirect back to main app login ────────
export async function clearCBTSession(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete("cbt_token");
	redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
}
