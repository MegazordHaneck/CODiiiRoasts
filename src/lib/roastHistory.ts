const STORAGE_KEY = "codiii-used-roasts";
const MAX_STORED = 400;

function normalize(roast: string): string {
  return roast.trim().toLowerCase().replace(/\s+/g, " ");
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return [];
}

function save(list: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_STORED)));
}

export function getUsedRoasts(): string[] {
  return load();
}

export function isRoastUsed(roast: string): boolean {
  const key = normalize(roast);
  return load().includes(key);
}

export function markRoastUsed(roast: string): void {
  const key = normalize(roast);
  if (!key) return;
  const list = load().filter((r) => r !== key);
  list.push(key);
  save(list);
}

/** Booth admin can clear from admin if needed later */
export function clearRoastHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
