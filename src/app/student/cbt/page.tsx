import { StudentDashboard } from "@/components/student/StudentDashboard";
import { StudentShell } from "@/components/student/StudentShell";

export default function StudentDashboardPage() {
  return (
    <StudentShell>
      <StudentDashboard />
    </StudentShell>
  );
}
