import { AuthRedirect } from "@/src/components/AuthRedirect";
import { Suspense } from "react";

export default function AuthEntryPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-full items-center justify-center bg-gray-50">
					<div className="flex flex-col items-center space-y-4">
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
						<p className="text-lg font-medium text-gray-600">
							Loading...
						</p>
					</div>
				</div>
			}
		>
			<AuthRedirect />
		</Suspense>
	);
}
