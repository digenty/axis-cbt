import { BranchLevels } from "@/types/branch";

const LEVEL_ORDER: Record<string, number> = {
  CRECHE: 0,
  KINDERGARTEN: 1,
  NURSERY: 2,
  PRIMARY: 3,
  JUNIOR_SECONDARY: 4,
  SENIOR_SECONDARY: 5,
};

export const extractUniqueLevelsByType = (branches: BranchLevels[]) => {
  const uniqueLevels = new Set<string>();

  return branches
    .flatMap((branch) =>
      branch.classLevels.map((level) => ({
        ...level,
        branchId: branch?.branchId,
      })),
    )
    .filter((level) => {
      if (uniqueLevels.has(level.levelType)) return false;
      uniqueLevels.add(level.levelType);
      return true;
    })
    .sort((a, b) => {
      const orderA = LEVEL_ORDER[a.levelType] ?? 99;
      const orderB = LEVEL_ORDER[b.levelType] ?? 99;
      return orderA - orderB;
    });
};
