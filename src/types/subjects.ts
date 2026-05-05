export interface ClassArmReportDtos {
  armId: number;
  classArmName: string;
  classId: number;
  reportStatus: string;
}
export interface ApiSubject {
  classArmReportDtos: ClassArmReportDtos[];
  subjectId: number;
  subjectName: string;
}

export interface TeacherSubjectsResponse {
  data: ApiSubject[];
  message: string;
  status: string;
}

export interface ApiSchoolResponse {
  active: boolean;
  address: string;
  adminId: number;
  country: string;
  createdAt: string;
  currency: string;
  email: string;
  id: number;
  logo: string;
  motto: string;
  name: string;
  phoneNumber: string;
  studentPopulation: number;
  timezone: string;
  updatedAt: string;
  uuid: string;
  version: number;
}

export interface ApiClassSubject {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  branchId: number;
  schoolId: number;

  teacherName: string;
  questionsInBank: number;
  assessmentCount: number;
}

export interface ClassSubjectsResponse {
  data: ApiClassSubject[];
  message: string;
  status: string;
}

export interface ApiClassArmSubject {
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  questionsInBank: number;
  testsCount: number;
}

export interface ApiArmSubject {
  armId: number;
  armName: string;
  className: string;
  displayName: string;
  classId: number;
  branchId: number;
  branchName: string;
  subjects: ApiClassArmSubject[];
}

export interface ApiArmSubjectsResponse {
  data: ApiArmSubject;
  message: string;
  status: string;
}
