"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createSession } from "@/actions/auth";

export const AuthRedirect = () => {
	const params = useSearchParams();
	const token = params.get("token");

	useEffect(() => {
		if (token) {
			createSession(token);
		} else {
			// If no token, redirect to the staff portal as requested
			window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/staff`;
		}
	}, [token]);

	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-50">
			<div className="flex flex-col items-center space-y-4">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
				<p className="text-lg font-medium text-gray-600">
					Verifying session...
				</p>
			</div>
		</div>
	);
};
