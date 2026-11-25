export const MAX_ADMINS = 2;
export const MAX_VIEWERS = 10;

const ADMIN_PATTERN = /^[^\s@]+@companyadmin\.co\.ke$/;
const VIEWER_PATTERN = /^[^\s@]+@company\.co\.ke$/;

export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getRoleFromEmail(email) {
  const clean = email.trim().toLowerCase();
  if (ADMIN_PATTERN.test(clean)) return "admin";
  if (VIEWER_PATTERN.test(clean)) return "viewer";
  return null;
}

// The version of a user that is safe to keep in the session (no password)
export function toSessionUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    jobTitle: user.jobTitle || "",
  };
}
