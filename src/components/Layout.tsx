"use client";

import React, { Suspense } from "react";
import { Header } from "./Header";
import { Spinner } from "./ui";

export default function Layout({
	children,
	href,
}: Readonly<{
	children: React.ReactNode;
	href?: string;
}>) {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<Spinner size="lg" />
				</div>
			}
		>
			<div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
				<div className="flex min-h-0 flex-1 flex-col">
					<Header href={href} />
					<div className="flex-1 overflow-y-auto p-8">{children}</div>
				</div>
			</div>
		</Suspense>
	);
}
