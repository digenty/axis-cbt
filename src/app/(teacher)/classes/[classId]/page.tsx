import { ClassSubjectsView } from "@/components/classes/ClassSubjectsView";

export default function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  return <ClassSubjectsView params={params} />;
}
