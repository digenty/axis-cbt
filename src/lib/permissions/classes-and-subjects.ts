export const canManageClassesAndSubjects = (permissions: string[] = []) =>
  permissions.includes("manage_classes_subjects");
