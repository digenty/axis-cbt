import { AppShell } from "@/components/layout/AppShell";
import { getSessionData } from "@/lib/cookies";
import { isAdmin } from "@/lib/permissions";

export default async function TeacherLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getSessionData();
	return <AppShell isAdmin={isAdmin(user?.permissions ?? [])}>{children}</AppShell>;
}
