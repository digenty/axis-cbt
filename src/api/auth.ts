/**
 * CBT Auth API — server-side only.
 *
 * Uses API_BASE_URL (no NEXT_PUBLIC_ prefix) so it resolves correctly
 * at runtime on the server. NEXT_PUBLIC_ vars are baked in at build time
 * for the browser bundle and can be undefined during SSR in some setups.
 */

const BASE_URL =
	process.env.API_BASE_URL ??
	process.env.NEXT_PUBLIC_API_BASE_URL ??
	"http://localhost:8080/api/v1";

export interface ReAuthResponse {
	data: { token: string };
	message: string;
	status: string;
}

export async function reAuthenticateToken(
	incomingToken: string,
): Promise<ReAuthResponse> {
	const res = await fetch(`${BASE_URL}/reauth/token`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${incomingToken}`,
			"Content-Type": "application/json",
		},
		cache: "no-store",
	});

	console.log({ res });

	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(
			`Re-auth failed: ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`,
		);
	}

	const json = await res.json();
	return json as ReAuthResponse;
}
