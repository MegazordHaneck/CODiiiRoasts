import type { Intensity, RoastResult } from "../types";
import fallbackRoasts from "../content/fallback-roasts.json";
import { violationsForRoast } from "./deriveViolations";
import { parseIntro } from "./parseIntro";
import { getUsedRoasts, isRoastUsed, markRoastUsed } from "./roastHistory";

type Outputs = {
  custom?: {
    roastUrl?: string;
    speakUrl?: string;
  };
};

let cachedOutputs: Outputs | null = null;

async function loadOutputs(): Promise<Outputs> {
  if (cachedOutputs) return cachedOutputs;
  try {
    const mod = await import("../../amplify_outputs.json");
    cachedOutputs = mod.default ?? mod;
    return cachedOutputs as Outputs;
  } catch {
    cachedOutputs = {};
    return cachedOutputs;
  }
}

function normalizeRoleKey(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("architect")) return "architect";
  if (r.includes("engineer")) return "engineer";
  if (r.includes("bim")) return "bim manager";
  if (r.includes("general contractor") || r === "gc") return "gc";
  if (r.includes("contractor")) return "contractor";
  if (r.includes("owner")) return "owner";
  if (r.includes("project") || r.includes("pm")) return "pm";
  if (r.includes("spec")) return "specifier";
  return "default";
}

function allFallbackTemplates(
  key: string,
  intensity: Intensity,
): string[] {
  const roasts = fallbackRoasts as Record<string, Record<Intensity, string>>;
  const pool = new Set<string>();
  for (const roleKey of [key, "default"]) {
    const t = roasts[roleKey]?.[intensity];
    if (t) pool.add(t);
  }
  return [...pool];
}

export function getFallbackRoast(
  name: string,
  role: string,
  intensity: Intensity,
  introTranscript?: string,
  attempt = 0,
): RoastResult {
  const key = normalizeRoleKey(role);
  const used = new Set(getUsedRoasts());
  const templates = allFallbackTemplates(key, intensity).filter(
    (t) => !used.has(t.replace(/\{name\}/g, name).trim().toLowerCase().replace(/\s+/g, " ")),
  );
  let template =
    templates[Math.floor(Math.random() * templates.length)] ??
    allFallbackTemplates(key, intensity)[0];

  let roast = template.replace(/\{name\}/g, name);
  if (introTranscript?.trim()) {
    const parsed = parseIntro(introTranscript);
    const who = parsed.name !== "friend" ? parsed.name : name;
    const punch = roast.replace(/^Hi [^!]+!\s*/i, "");
    const tail = punch ? `${punch.charAt(0).toLowerCase()}${punch.slice(1)}` : "your workflow is pure chaos.";
    roast = `Oh hi ${who}! You said you're a ${parsed.role} — that explains why ${tail}`;
  }

  if (isRoastUsed(roast) && attempt < 5) {
    const salt = ` (booth pass ${Date.now() % 1000})`;
    if (!roast.includes("pass")) {
      roast = `${roast.replace(/\.$/, "")}${salt}.`;
    } else {
      return getFallbackRoast(name, role, intensity, introTranscript, attempt + 1);
    }
  }

  const violations = violationsForRoast(roast);
  return { roast, violations, fallback: true };
}

function finalizeRoast(data: RoastResult): RoastResult {
  const violations = violationsForRoast(data.roast, data.violations);
  return { ...data, violations };
}

async function requestRoast(
  url: string,
  input: {
    name: string;
    role: string;
    company?: string;
    introTranscript?: string;
    intensity: Intensity;
    safeMode: boolean;
    excludeRoasts?: string[];
  },
): Promise<RoastResult> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("roast failed");
  return (await res.json()) as RoastResult;
}

export async function fetchRoast(input: {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  intensity: Intensity;
  safeMode: boolean;
}): Promise<RoastResult> {
  const outputs = await loadOutputs();
  const url = import.meta.env.VITE_ROAST_URL ?? outputs.custom?.roastUrl;
  const excludeRoasts = getUsedRoasts().slice(-80);

  const pickUnique = async (): Promise<RoastResult> => {
    if (!url) {
      return finalizeRoast(getFallbackRoast(input.name, input.role, input.intensity, input.introTranscript));
    }

    let last: RoastResult | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const data = finalizeRoast(
        await requestRoast(url, {
          ...input,
          excludeRoasts: [...excludeRoasts, ...(last ? [last.roast] : [])],
        }),
      );
      if (!isRoastUsed(data.roast)) return data;
      last = data;
    }
    if (last && !isRoastUsed(last.roast)) return last;
    return finalizeRoast(getFallbackRoast(input.name, input.role, input.intensity, input.introTranscript));
  };

  try {
    const data = await pickUnique();
    markRoastUsed(data.roast);
    return data;
  } catch {
    const data = finalizeRoast(
      getFallbackRoast(input.name, input.role, input.intensity, input.introTranscript),
    );
    markRoastUsed(data.roast);
    return data;
  }
}

export async function fetchSpeech(text: string): Promise<ArrayBuffer | null> {
  const outputs = await loadOutputs();
  const url = import.meta.env.VITE_SPEAK_URL ?? outputs.custom?.speakUrl;

  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export function exportSessionsCsv(
  sessions: { timestamp: string; name: string; role: string; intensity: string; fallback: boolean; latencyMs: number }[],
): string {
  const header = "timestamp,name,role,intensity,fallback,latencyMs";
  const rows = sessions.map(
    (s) =>
      `${s.timestamp},${JSON.stringify(s.name)},${JSON.stringify(s.role)},${s.intensity},${s.fallback},${s.latencyMs}`,
  );
  return [header, ...rows].join("\n");
}
