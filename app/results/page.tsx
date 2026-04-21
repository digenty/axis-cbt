import { GlobalResultsView } from "@/components/GlobalResultsView";
import { Sidebar } from "@/components/Sidebar";

export default function ResultsPage() {
  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar />
      <div className="ml-56 flex min-h-0 flex-1 flex-col overflow-hidden">
        <GlobalResultsView />
      </div>
    </div>
  );
}
