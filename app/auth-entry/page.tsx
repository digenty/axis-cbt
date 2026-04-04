/**
 * /auth-entry — CBT Auth Bridge (Server Component)
 *
 * All logic runs directly in this server component — no server action
 * intermediary. This avoids the "cookies written inside a server action
 * called from a server component don't flush before redirect" bug.
 *
 * Flow:
 *   A. ?token=<JWT> in URL
 *      → call GET /reauth/token with it as Bearer
 *      → write verified token to httpOnly + JS-readable cookies
 *      → redirect(returnTo)   ← clean URL, no token visible
 *
 *   B. No ?token but "token" cookie already present (same-domain)
 *      → mirror to JS-readable cbt_token cookie
 *      → redirect(returnTo)
 *
 *   C. Nothing found → redirect to main app login
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { reAuthenticateToken } from "@/api/auth";
import { writeTokenCookies } from "@/lib/auth-session";

const MAIN_APP_URL =
	process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:8005/subjects";
const MAIN_APP_LOGIN_PATH =
	process.env.NEXT_PUBLIC_MAIN_APP_LOGIN_PATH ?? "/auth/staff";
const MAIN_LOGIN = `${MAIN_APP_URL}${MAIN_APP_LOGIN_PATH}`;

const COOKIE_MAX_AGE = 60 * 60 * 8;
const cookieBase = {
	sameSite: "lax" as const,
	path: "/",
	maxAge: COOKIE_MAX_AGE,
	secure: process.env.NODE_ENV === "production",
};

interface Props {
	searchParams: Promise<{ token?: string; returnTo?: string }>;
}

export default async function AuthEntryPage({ searchParams }: Props) {
	const params = await searchParams;
	const returnTo = params.returnTo ?? "/subjects";
	const cookieStore = await cookies();

	// ── A: raw token in URL ──────────────────────────────────────────────────────
	if (params.token) {
		let verifiedToken: string;

		try {
			const response = await reAuthenticateToken(params.token);
			// alert({ reAuthenticateToken: response });
			// console.log({ reAuthenticateToken: response });
			verifiedToken = response?.data?.token;

			// if (!verifiedToken) {
			// 	console.error(
			// 		"[auth-entry] /reauth/token returned no token:",
			// 		response,
			// 	);
			// 	redirect(MAIN_LOGIN);
			// }
		} catch (err) {
			console.error("[auth-entry] reauth fetch failed:", err);
			redirect(MAIN_LOGIN);
		}

		await writeTokenCookies(verifiedToken);

		// Write cookies directly here — not via a server action — so they are
		// guaranteed to be set before the redirect response is sent.
		// const serialised = JSON.stringify(verifiedToken!);
		// cookieStore.set("token", serialised, { ...cookieBase, httpOnly: true });
		// cookieStore.set("cbt_token", serialised, {
		// 	...cookieBase,
		// 	httpOnly: false,
		// });

		// redirect(returnTo);
		window.location.href = "localhost:8005/subjects";

		// console.log("auth entry");

		// return <div className="bg-red-600 p-24">auth entry page</div>;
	}

	// ── B: httpOnly cookie already present (same-domain) ────────────────────────
	const existing = cookieStore.get("token")?.value;
	if (existing) {
		// Mirror to JS-readable cookie for the client Axios interceptor
		cookieStore.set("cbt_token", existing, {
			...cookieBase,
			httpOnly: false,
		});
		redirect(returnTo);
	}

	// ── C: nothing → back to main login ─────────────────────────────────────────
	redirect(MAIN_LOGIN);
}
