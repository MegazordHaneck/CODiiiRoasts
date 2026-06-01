/** Share-safe leetspeak censoring — booth display, cards, and social posts. */

type Rule = { pattern: RegExp; replace: string };

/** Longest / most specific phrases first */
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
  { pattern: /\bAI'?s\s+b#@\$h\b/gi, replace: "#AI'sB#@$H" },
];

const SPEECH_RULES: Rule[] = [
  { pattern: /F@#%NG/gi, replace: "freaking" },
  { pattern: /F@#%N'?/gi, replace: "freaking" },
  { pattern: /F@#%D/gi, replace: "freaked" },
  { pattern: /F@#%\$/gi, replace: "fool" },
  { pattern: /F@#%/gi, replace: "eff" },
  { pattern: /SH!TTY/gi, replace: "lousy" },
  { pattern: /SH!TSH0W/gi, replace: "mess" },
  { pattern: /BULLSH!T/gi, replace: "nonsense" },
  { pattern: /SH!T/gi, replace: "shoot" },
  { pattern: /@\$\$H0LE/gi, replace: "jerk" },
  { pattern: /#AI'sB#@\$H/gi, replace: "AI's replacement" },
  { pattern: /B#@\$H/gi, replace: "pain" },
  { pattern: /D@MN/gi, replace: "darn" },
  { pattern: /H3LL/gi, replace: "heck" },
  { pattern: /CR@P/gi, replace: "junk" },
  { pattern: /M0TH3RF@#%\$/gi, replace: "jerks" },
];

function applyRules(text: string, rules: Rule[]): string {
  let out = text;
  for (const { pattern, replace } of rules) {
    out = out.replace(pattern, replace);
  }
  return out;
}

/** Censor profanity for on-screen text, share cards, and uploads. */
export function censorProfanityForShare(text: string): string {
  return applyRules(text, CENSOR_RULES);
}

/** Plain speech for TTS / browser voice when the stored roast is censored. */
export function roastForSpeech(censoredRoast: string): string {
  return applyRules(censoredRoast, SPEECH_RULES);
}
