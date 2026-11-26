export const MAX_ADMINS = 2;
export const MAX_VIEWERS = 10;

const ADMIN_PATTERN = /^[^\s@]+@companyadmin\.co\.ke$/;
const VIEWER_PATTERN = /^[^\s@]+@company\.co\.ke$/;

export function getRoleFromEmail(email) {
  const clean = email.trim().toLowerCase();
  if (ADMIN_PATTERN.test(clean)) return "admin";
  if (VIEWER_PATTERN.test(clean)) return "viewer";
  return null;
}
