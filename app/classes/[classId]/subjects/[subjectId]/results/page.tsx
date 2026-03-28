import Results from "@/components/Results";
import React from "react";

const ResultsPage = ({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) => {
	return <Results params={params} />;
};

export default ResultsPage;
