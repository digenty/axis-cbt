"use server";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  redirect(`${process.env.NEXT_PUBLIC_MAIN_APP_URL}/auth/staff`);
};

export const getSessionToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect(`${process.env.NEXT_PUBLIC_MAIN_APP_URL}/auth/staff`);
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
