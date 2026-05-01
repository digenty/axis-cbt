import { getSessionData } from "@/lib/cookies";
import { redirect } from "next/navigation";


export default async function CBTHome() {
	const { user } = await getSessionData();
	// redirect(isAdmin(user?.permissions ?? []) ? "/classes" : "/subjects");
	redirect(user?.isAdmin || user?.isMain ? "/classes" : "/subjects");
}
