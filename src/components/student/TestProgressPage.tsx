"use client";

import { use } from "react";
import { TestRunner } from "./TestRunner";

interface TestProgressPageProps {
  params: Promise<{ testId: string }>;
}

export const TestProgressPage = ({ params }: TestProgressPageProps) => {
  const { testId } = use(params);
  return <TestRunner testId={testId} studentName="Damilare John" />;
};
