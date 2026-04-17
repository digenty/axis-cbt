import ResultsPage from "@/components/ResultsPage";

const ResultsViewPage = ({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) => {
	return <ResultsPage params={params} />;
};

export default ResultsViewPage;
