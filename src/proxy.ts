import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STUDENT_LOGIN = "/student/login";
const STUDENT_CBT = "/student/cbt";

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

  // Static assets
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }

  const studentToken = request.cookies.get("student_token")?.value;
  const teacherToken = request.cookies.get("token")?.value;

  // ─── Student CBT routes ────────────────────────────────────────────────────
  if (pathname.startsWith(STUDENT_CBT)) {
    if (!studentToken) {
      return NextResponse.redirect(new URL(STUDENT_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  // ─── Student login page ────────────────────────────────────────────────────
  if (pathname === STUDENT_LOGIN) {
    if (studentToken) {
      return NextResponse.redirect(new URL(STUDENT_CBT, request.url));
    }
    return NextResponse.next();
  }

  // ─── Public prefixes ───────────────────────────────────────────────────────
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ─── Teacher/staff routes ──────────────────────────────────────────────────
  if (studentToken && !teacherToken) {
    return NextResponse.redirect(new URL(STUDENT_CBT, request.url));
  }

  if (!teacherToken) {
    const main = process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "";
    return NextResponse.redirect(`${main}/auth/staff`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
