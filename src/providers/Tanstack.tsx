"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClient as client } from "@/lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
	children: ReactNode;
};

export const TanstackProvider = ({ children }: Props) => {
	const [queryClient] = useState(() => client);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
};
