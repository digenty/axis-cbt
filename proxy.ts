/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * Runs on every request before the page renders.
 * Checks for the shared "token" cookie written by the main app.
 * If absent, redirects to the /auth-entry page (which in turn redirects
 * back to the main app login so the user can re-authenticate).
 *
 * Public paths (anything starting with /auth-entry, /_next, /favicon, /api)
 * are exempted so the entry page itself and static assets are always reachable.
 */

import { NextRequest, NextResponse } from "next/server";

/** Paths that don't require authentication */
const PUBLIC_PREFIXES = [
	"/auth-entry",
	"/_next/",
	"/favicon",
	"/api/",
	"/robots",
	"/sitemap",
];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
		return NextResponse.next();
	}

	const token = request.cookies.get("token")?.value;

	if (!token) {
		const entryUrl = new URL("/auth-entry", request.url);
		entryUrl.searchParams.set("returnTo", pathname);
		return NextResponse.redirect(entryUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
