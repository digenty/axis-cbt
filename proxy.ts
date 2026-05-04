import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
	if (token) return NextResponse.next();

	const main = process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "";
	return NextResponse.redirect(`${main}/auth/staff`);
}

export const config = {
	matcher: [
		"/((?!auth-entry|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
	],
};
