export type ClassLevelType =
  | "CRECHE"
  | "KINDERGARTEN"
  | "NURSERY"
  | "PRIMARY"
  | "JUNIOR_SECONDARY"
  | "SENIOR_SECONDARY";

export interface ApiClassLevel {
  id: number;
  name: string;
  levelType: ClassLevelType;
}

export interface ApiClassArm {
  id: number;
  name: string;
}

export interface ApiClass {
  id: number;
  name: string;
  level: ApiClassLevel;
  arms: ApiClassArm[];
  schoolId?: number;
  branchId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassesResponse {
  data: {
    content: ApiClass[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}
