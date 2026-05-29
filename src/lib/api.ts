import type { Intensity, RoastResult } from "../types";
import fallbackRoasts from "../content/fallback-roasts.json";
import violationTemplates from "../content/violation-templates.json";

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

export function getFallbackRoast(
  name: string,
  role: string,
  intensity: Intensity,
): RoastResult {
  const key = normalizeRoleKey(role);
  const roasts = fallbackRoasts as Record<string, Record<Intensity, string>>;
  const template =
    roasts[key]?.[intensity] ?? roasts.default[intensity];
  const violationsMap = violationTemplates as Record<string, string[]>;
  const violations = violationsMap[key] ?? violationsMap.default;
  return {
    roast: template.replace(/\{name\}/g, name),
    violations: violations.slice(0, 3),
    fallback: true,
  };
}

export async function fetchRoast(input: {
  name: string;
  role: string;
  company?: string;
  intensity: Intensity;
  safeMode: boolean;
}): Promise<RoastResult> {
  const outputs = await loadOutputs();
  const url =
    import.meta.env.VITE_ROAST_URL ??
    outputs.custom?.roastUrl;

  if (!url) {
    return getFallbackRoast(input.name, input.role, input.intensity);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("roast failed");
    const data = (await res.json()) as RoastResult;
    return data;
  } catch {
    return getFallbackRoast(input.name, input.role, input.intensity);
  }
}

export async function fetchSpeech(text: string): Promise<ArrayBuffer | null> {
  const outputs = await loadOutputs();
  const url =
    import.meta.env.VITE_SPEAK_URL ??
    outputs.custom?.speakUrl;

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
