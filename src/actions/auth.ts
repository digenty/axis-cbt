"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isTokenExpired, decodeJWT } from "@/lib/utils";

export async function createSession(token: string) {
	if (!token || isTokenExpired(token)) {
		redirect(`${process.env.NEXT_PUBLIC_MAIN_APP_URL}/staff`);
	}

	const decoded = decodeJWT(token);
	const expiresAt = decoded?.exp
		? new Date(decoded.exp * 1000)
		: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const cookieStore = await cookies();

	cookieStore.set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		sameSite: "strict",
		path: "/",
	});

	redirect("/subjects");
}
