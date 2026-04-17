"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";
const MAIN_APP_LOGIN_PATH =
  process.env.NEXT_PUBLIC_MAIN_APP_LOGIN_PATH ?? "/auth/staff";

const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// ─── Shared cookie writer ─────────────────────────────────────────────────────
export async function writeTokenCookies(verifiedToken: string): Promise<void> {
  const cookieStore = await cookies();
  const serialised = JSON.stringify(verifiedToken);
  const shared = {
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };

  // httpOnly copy — read by middleware and server actions
  cookieStore.set("token", serialised, { ...shared, httpOnly: true });

  // JS-readable copy — read by client-side Axios interceptor
  cookieStore.set("cbt_token", serialised, { ...shared, httpOnly: false });
}

// ─── Read the stored verified token (server-side) ────────────────────────────
export async function getSessionToken(): Promise<{ token: string }> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if (!raw) redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);

  try {
    return { token: JSON.parse(raw!) as string };
  } catch {
    redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
  }
}

// ─── Mirror existing httpOnly token to JS-readable cookie ─────────────────────
// Used in same-domain scenario where the browser already sent the httpOnly cookie.
export async function bootstrapClientToken(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;
  if (!raw) return;

  cookieStore.set("cbt_token", raw, {
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
}

// ─── Clear all CBT session cookies ───────────────────────────────────────────
export async function clearCBTSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("cbt_token");
  redirect(`${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`);
}
