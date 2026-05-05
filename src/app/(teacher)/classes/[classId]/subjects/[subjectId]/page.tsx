import { SubjectDetailView } from "@/components/classes/SubjectDetailView";

export default function SubjectDetailPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  return <SubjectDetailView params={params} />;
}
