/**
 * GET /auth-entry — CBT Auth Bridge (Route Handler)
 *
 * Route Handlers are explicitly allowed to set cookies and return redirects.
 * Server Component pages are NOT — hence the move from page.tsx to route.ts.
 *
 * Flow:
 *   A. ?token=<JWT> present
 *      → call GET /reauth/token with it as Bearer
 *      → write verified token to httpOnly + JS-readable cookies
 *      → 302 to returnTo (clean URL, no token visible in browser history)
 *
 *   B. No ?token but "token" cookie already present (same-domain)
 *      → mirror it to JS-readable cbt_token cookie
 *      → 302 to returnTo
 *
 *   C. Nothing found
 *      → 302 to main app login
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { reAuthenticateToken } from "@/api/auth";

const MAIN_APP_URL =
	process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";
const MAIN_APP_LOGIN_PATH =
	process.env.NEXT_PUBLIC_MAIN_APP_LOGIN_PATH ?? "/auth/staff";
const MAIN_LOGIN = `${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`;

const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours
const cookieBase = {
	sameSite: "lax" as const,
	path: "/",
	maxAge: COOKIE_MAX_AGE,
	secure: process.env.NODE_ENV === "production",
};

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const incomingToken = searchParams.get("token");
	const returnTo = searchParams.get("returnTo") ?? "/subjects";

	const cookieStore = await cookies();

	// ── A: raw token in URL → reauth → set cookies → redirect ───────────────────
	if (incomingToken) {
		let verifiedToken: string | null = null;

		try {
			const response = await reAuthenticateToken(incomingToken);
			verifiedToken = response?.data?.token ?? null;

			if (!verifiedToken) {
				console.error(
					"[auth-entry] /reauth/token returned no token:",
					JSON.stringify(response),
				);
			}
		} catch (err) {
			console.error(
				"[auth-entry] reAuthenticateToken threw:",
				err instanceof Error ? err.message : String(err),
			);
		}

		if (!verifiedToken) {
			return NextResponse.redirect(MAIN_LOGIN);
		}

		const serialised = JSON.stringify(verifiedToken);
		cookieStore.set("token", serialised, { ...cookieBase, httpOnly: true });
		cookieStore.set("cbt_token", serialised, {
			...cookieBase,
			httpOnly: false,
		});

		return NextResponse.redirect(new URL(returnTo, request.url));
	}

	// ── B: httpOnly cookie already present (same-domain) ────────────────────────
	const existing = cookieStore.get("token")?.value;
	if (existing) {
		cookieStore.set("cbt_token", existing, {
			...cookieBase,
			httpOnly: false,
		});
		return NextResponse.redirect(new URL(returnTo, request.url));
	}

	// ── C: nothing found → back to main app login ────────────────────────────────
	return NextResponse.redirect(MAIN_LOGIN);
}
