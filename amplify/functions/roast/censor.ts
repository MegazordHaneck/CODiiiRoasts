/** Mirror of src/lib/profanityCensor.ts for Lambda responses */

type Rule = { pattern: RegExp; replace: string };

const CENSOR_RULES: Rule[] = [
  { pattern: /\bwhat\s+the\s+fuck\b/gi, replace: "what the F@#%" },
  { pattern: /\bwhat\s+the\s+hell\b/gi, replace: "what the H3LL" },
  { pattern: /\bmotherfuckers?\b/gi, replace: "M0TH3RF@#%$" },
  { pattern: /\bmotherfucking\b/gi, replace: "M0TH3RF@#%NG" },
  { pattern: /\bfucking\b/gi, replace: "F@#%NG" },
  { pattern: /\bfuckin'\b/gi, replace: "F@#%N'" },
  { pattern: /\bfuckin\b/gi, replace: "F@#%N" },
  { pattern: /\bfucked\b/gi, replace: "F@#%D" },
  { pattern: /\bfucker\b/gi, replace: "F@#%$" },
  { pattern: /\bfucks?\b/gi, replace: "F@#%" },
  { pattern: /\bshitty\b/gi, replace: "SH!TTY" },
  { pattern: /\bshitshow\b/gi, replace: "SH!TSH0W" },
  { pattern: /\bbullshit\b/gi, replace: "BULLSH!T" },
  { pattern: /\bshit\b/gi, replace: "SH!T" },
  { pattern: /\bassholes?\b/gi, replace: "@$$H0LE" },
  { pattern: /\bbitch(?:es)?\b/gi, replace: "B#@$H" },
  { pattern: /\bdamn\b/gi, replace: "D@MN" },
  { pattern: /\bhell\b/gi, replace: "H3LL" },
  { pattern: /\bcrap\b/gi, replace: "CR@P" },
];

export function censorProfanityForShare(text: string): string {
  let out = text;
  for (const { pattern, replace } of CENSOR_RULES) {
    out = out.replace(pattern, replace);
  }
  return out;
}
