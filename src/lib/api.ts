import type { Intensity, RoastResult } from "../types";
import { getTemplatePool, type RolePoolKey } from "../content/roast-pools";
import { violationsForRoast } from "./deriveViolations";
import { parseIntro } from "./parseIntro";
import { getUsedRoasts, markRoastUsed } from "./roastHistory";
import {
  CREATIVE_ANGLES,
  generateCombinatorialRoast,
  isRoastRepetitive,
  wrapIntroRoast,
} from "./roastVariety";

type Outputs = {
  custom?: {
    roastUrl?: string;
    speakUrl?: string;
    shareApiUrl?: string;
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

function normalizeRoleKey(role: string): RolePoolKey {
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
  introTranscript?: string,
  attempt = 0,
): RoastResult {
  const key = normalizeRoleKey(role);
  const used = getUsedRoasts();
  const pool = getTemplatePool(key, intensity);

  const parsed = introTranscript?.trim() ? parseIntro(introTranscript) : null;
  const who = parsed && parsed.name !== "friend" ? parsed.name : name;
  const roleLabel = parsed?.role ?? role;

  let roast: string;

  if (attempt < pool.length * 2) {
    const available = pool.filter((t) => {
      const filled = t.replace(/\{name\}/g, name);
      const candidate =
        parsed && introTranscript?.trim()
          ? wrapIntroRoast(who, roleLabel, filled, attempt)
          : filled;
      return !isRoastRepetitive(candidate, used);
    });
    const template =
      available[attempt % Math.max(available.length, 1)] ??
      pool[(attempt + Math.floor(Math.random() * pool.length)) % pool.length];

    roast =
      parsed && introTranscript?.trim()
        ? wrapIntroRoast(who, roleLabel, template.replace(/\{name\}/g, name), attempt)
        : template.replace(/\{name\}/g, name);
  } else {
    const seed = attempt + Date.now() + name.length;
    roast = generateCombinatorialRoast(name, intensity, seed);
    if (parsed && introTranscript?.trim()) {
      roast = wrapIntroRoast(who, roleLabel, roast, attempt);
    }
  }

  if (isRoastRepetitive(roast, used) && attempt < 40) {
    return getFallbackRoast(name, role, intensity, introTranscript, attempt + 1);
  }

  return {
    roast,
    violations: violationsForRoast(roast),
    fallback: true,
  };
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
    variationHint?: string;
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
  const excludeRoasts = getUsedRoasts().slice(-150);

  const pickUnique = async (): Promise<RoastResult> => {
    if (!url) {
      return finalizeRoast(getFallbackRoast(input.name, input.role, input.intensity, input.introTranscript));
    }

    const tried: string[] = [];
    for (let attempt = 0; attempt < 8; attempt++) {
      const data = finalizeRoast(
        await requestRoast(url, {
          ...input,
          excludeRoasts: [...excludeRoasts, ...tried],
          variationHint: CREATIVE_ANGLES[(attempt + input.name.length) % CREATIVE_ANGLES.length],
        }),
      );
      if (!isRoastRepetitive(data.roast, [...excludeRoasts, ...tried])) {
        return data;
      }
      tried.push(data.roast);
    }

    return finalizeRoast(
      getFallbackRoast(input.name, input.role, input.intensity, input.introTranscript, tried.length),
    );
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
