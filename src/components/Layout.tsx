import React from "react";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
			<div className="flex min-h-0 flex-1 flex-col">
				{/* <Header /> */}
				<div className="flex-1 overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}
