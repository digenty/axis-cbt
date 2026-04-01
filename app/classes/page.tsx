import { AllClassesView } from "@/components/AllClassesView";
import Layout from "@/components/Layout";

export default function ClassesPage() {
	return (
		<Layout>
			<div className="mb-5">
				<h1 className="text-lg font-semibold text-gray-900">All Classes</h1>
			</div>
			<AllClassesView />
		</Layout>
	);
}
