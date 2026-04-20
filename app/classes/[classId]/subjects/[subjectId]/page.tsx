import SubjectDetails from "@/components/subjects/SubjectDetails";

export default function SubjectDetailsPage({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) {
	return <SubjectDetails params={params} />;
}
