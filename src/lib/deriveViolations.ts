/** Fake compliance flags that riff on the actual roast text */
export function deriveViolationsFromRoast(roast: string): string[] {
  const lower = roast.toLowerCase();
  const out: string[] = [];

  const rules: [RegExp, string][] = [
    [/\brfi\b|inbox/i, "Violation: RFI / inbox gravitational anomaly"],
    [/stair|revision|minimal/i, "Detected: design revision recursion"],
    [/bim|navis|clash|coordination|federat/i, "Flagged: model coordination meltdown"],
    [/redline|drawing|calc/i, "Warning: drawing set trust deficit"],
    [/submittal|mobiliz|field|contractor/i, "Detected: field-vs-drawing timeline paradox"],
    [/schedule|gantt|float|deadline/i, "Violation: schedule optimism exceeds reality"],
    [/meeting|calendar|weekend/i, "Flagged: meeting density critical"],
    [/architect|engineer|spec|owner|gc\b/i, "CODiii role-based exposure index: elevated"],
    [/explains why|that explains/i, "Evidence: causal link to AEC chaos confirmed"],
  ];

  for (const [re, msg] of rules) {
    if (re.test(lower) && !out.includes(msg)) out.push(msg);
  }

  const snippet = roast.replace(/"/g, "").trim();
  const quote =
    snippet.length > 52 ? `${snippet.slice(0, 52).trim()}…` : snippet;
  out.unshift(`Logged from roast: “${quote}”`);

  const fillers = [
    "Severity: conference-grade burn",
    "Recommendation: hide redlines before family dinner",
    "Status: roastee ego — structurally compromised",
  ];
  for (const f of fillers) {
    if (out.length >= 3) break;
    if (!out.includes(f)) out.push(f);
  }

  return out.slice(0, 3);
}

export function violationsForRoast(roast: string, fromApi?: string[]): string[] {
  if (fromApi?.length) {
    const tokens = roast
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4);
    const related = fromApi.filter((v) => {
      const vl = v.toLowerCase();
      return tokens.some((t) => vl.includes(t));
    });
    if (related.length >= 2) return fromApi.slice(0, 3);
  }
  return deriveViolationsFromRoast(roast);
}
