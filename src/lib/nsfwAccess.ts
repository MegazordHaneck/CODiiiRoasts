const UNLOCK_KEY = "codiii-nsfw-unlocked";
const DISCLAIMER_KEY = "codiii-nsfw-disclaimer";

export function getNsfwPin(): string {
  return import.meta.env.VITE_NSFW_PIN ?? "1818";
}

export function isNsfwDisclaimerAccepted(): boolean {
  try {
    return sessionStorage.getItem(DISCLAIMER_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNsfwDisclaimerAccepted(): void {
  try {
    sessionStorage.setItem(DISCLAIMER_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function isNsfwSessionUnlocked(): boolean {
  try {
    return (
      sessionStorage.getItem(UNLOCK_KEY) === "1" && sessionStorage.getItem(DISCLAIMER_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function markNsfwSessionUnlocked(): void {
  try {
    sessionStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearNsfwSession(): void {
  try {
    sessionStorage.removeItem(UNLOCK_KEY);
    sessionStorage.removeItem(DISCLAIMER_KEY);
  } catch {
    /* ignore */
  }
}
