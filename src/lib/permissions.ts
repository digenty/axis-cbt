// Update this string to match the permission your backend issues to admin/principal users.
const ADMIN_PERMISSION = "ADMIN";

export const isAdmin = (permissions: string[]): boolean =>
  permissions.some((p) => p.includes(ADMIN_PERMISSION));
