"use server";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createSession = async (
	token: string,
	userType: "SCHOOL_STAFF" | "PARENT",
) => {
	const cookieStore = await cookies();

	cookieStore.set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	redirect(`/${userType === "SCHOOL_STAFF" ? "staff" : "parents"}`);
};

export const deleteSession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("token");

	redirect("/auth/staff");
};

export const getSessionToken = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		redirect("/auth");
	}

	return { token };
};

export const getSessionData = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return { user: null };
	}

	const user: JWTPayload | null = decodeJWT(token);
	return { user };
};
