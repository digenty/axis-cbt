import QuestionBank from "@/components/QuestionBank";
import React from "react";

const QuestionBankPage = ({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) => {
	return <QuestionBank params={params} />;
};

export default QuestionBankPage;
