"use client";

import { use, useState } from "react";
import { TestInstructionsView } from "./TestInstructionsView";
import { TestRunner } from "./TestRunner";

interface StudentTestPageProps {
  params: Promise<{ testId: string }>;
}

export const StudentTestPage = ({ params }: StudentTestPageProps) => {
  const { testId } = use(params);
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <TestInstructionsView testId={testId} onBegin={() => setStarted(true)} />
    );
  }

  return <TestRunner testId={testId} studentName="Damilare John" />;
};
