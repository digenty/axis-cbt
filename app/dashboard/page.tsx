import { DashboardView } from "@/components/DashboardView";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar />
      <div className="ml-56 flex min-h-0 flex-1 flex-col overflow-hidden">
        <DashboardView />
      </div>
    </div>
  );
}
