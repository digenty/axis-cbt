/**
 * Next.js Edge Middleware for the CBT app.
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

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Let public paths through
	if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
		return NextResponse.next();
	}

	// Check for the main app's httpOnly token cookie
	const token = request.cookies.get("token")?.value;

	if (!token) {
		// Redirect to the entry page which will handle forwarding to the main login
		const entryUrl = new URL("/auth-entry", request.url);
		// Pass the original destination so we can deep-link after login
		entryUrl.searchParams.set("returnTo", pathname);
		return NextResponse.redirect(entryUrl);
	}

	// Token exists → let the request through
	return NextResponse.next();
}

export const config = {
	// Run on all routes except Next.js internals and static files
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
