export interface Branch {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  schoolId: number;
  name: string | null;
  address: string | null;
  phoneNumber: string;
  email: string;
  branchHeadId: number;
  country: string | null;
}

export type LevelType =
  | "CRECHE"
  | "KINDERGARTEN"
  | "NURSERY"
  | "PRIMARY"
  | "JUNIOR_SECONDARY"
  | "SENIOR_SECONDARY";

export interface BranchClassLevel {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  levelName: string;
  levelType: LevelType;
  classNamePrefix: string | null;
  classStart: number | null;
  classEnd: number | null;
  branchId: number;
  schoolId: number;
}

export interface BranchWithClassLevels {
  branch: Branch;
  classLevels: BranchClassLevel[];
}

export interface BranchesResponse {
  data: BranchWithClassLevels[];
}

export interface ClassLevelName {
  id: number;
  levelId: number;
  name: string;
  levelType: LevelType;
}

export interface ClassLevelNamesResponse {
  data: BranchLevels[];
}

export interface ClassLevel {
  id: number;
  levelName: string;
  levelType: LevelType;
  classNamePrefix: string;
  classStart: number;
  classEnd: number;
}

export interface BranchLevels {
  branchId: number;
  branchName: string;
  classLevels: ClassLevel[];
}
