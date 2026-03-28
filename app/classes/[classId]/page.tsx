import ClassDetails from "@/components/ClassDetails";

export default function ClassDetailsPage({
	params,
}: Readonly<{
	params: Promise<{ classId: string }>;
}>) {
	return <ClassDetails params={params} />;
}
