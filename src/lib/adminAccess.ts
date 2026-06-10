import { getNsfwPin } from "./nsfwAccess";

const ADMIN_SESSION_KEY = "codiii-admin-authed";

function getAdminPin(): string {
  const dedicated = import.meta.env.VITE_ADMIN_PIN?.trim();
  if (dedicated) return dedicated;
  return getNsfwPin();
}

export function verifyAdminPin(pin: string): boolean {
  return pin.trim() === getAdminPin();
}

export function isAdminSessionAuthed(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAdminSessionAuthed(): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}
