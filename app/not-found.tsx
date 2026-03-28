"use client";

import { PageEmptyState } from "@/src/components/PageEmptyState";

// import { PageEmptyState } from "@/components/Error/PageEmptyState";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
			<PageEmptyState
				title="Page Not Found"
				description="The page you are looking for does not exist."
				buttonText="Go to Home page"
			/>
		</div>
	);
}
