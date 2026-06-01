export const BANNED_ROAST_PHRASES = [
  "compliance scan needed a coffee",
  "codiii's compliance scan",
  "codiii compliance scan",
  "needed a coffee after your workflow",
  "coordination confidence is lower",
  "even codiii",
  "your workflow is pure chaos",
];

export function normalizeRoast(roast: string): string {
  return roast.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isRoastRepetitive(roast: string, usedRoasts: string[]): boolean {
  const n = normalizeRoast(roast);
  for (const banned of BANNED_ROAST_PHRASES) {
    if (n.includes(banned)) return true;
  }
  for (const prev of usedRoasts) {
    const p = normalizeRoast(prev);
    if (n === p) return true;
    if (n.length > 24 && p.length > 24 && (n.includes(p) || p.includes(n))) return true;
    const overlap = wordOverlap(n, p);
    if (overlap >= 0.62) return true;
  }
  return false;
}

function wordOverlap(a: string, b: string): number {
  const wordsA = a.split(/\W+/).filter((w) => w.length > 3);
  const wordsB = new Set(b.split(/\W+/).filter((w) => w.length > 3));
  if (wordsA.length === 0) return 0;
  let hit = 0;
  for (const w of wordsA) if (wordsB.has(w)) hit += 1;
  return hit / wordsA.length;
}
