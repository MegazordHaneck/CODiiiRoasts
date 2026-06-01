import type { Intensity, RoastResult } from "../types";
import { formatIndustryContextForPrompt } from "../content/industry/hatBurns";
import { pickMeanModeRoast } from "../content/mean-mode-roasts";
import { getTemplatePool, type RolePoolKey } from "../content/roast-pools";
import { resolveRolePoolKey } from "./parseIntro";
import { violationsForRoast } from "./deriveViolations";
import { censorProfanityForShare } from "./profanityCensor";
import { parseIntro } from "./parseIntro";
import { getUsedRoasts, markRoastUsed } from "./roastHistory";
import {
  CREATIVE_ANGLES,
  generateCombinatorialRoast,
  isRoastRepetitive,
} from "./roastVariety";

function personalizeFallback(
  who: string,
  role: string,
  company: string | undefined,
  templateLine: string,
  salt: number,
): string {
  const punch = templateLine.replace(/^Hi [^!]+!\s*/i, "");
  const tail = punch
    ? `${punch.charAt(0).toLowerCase()}${punch.slice(1)}`
    : "your project habits are giving the whole trade trust issues.";
  const atCo = company ? ` at ${company}` : "";
  const openers = [
    `Oh hi ${who}! You're a ${role}${atCo} — ${tail}`,
    `Hey ${who} — ${role}${atCo}? Yeah, ${tail}`,
    `${who}, ${role}${atCo} — ${tail.charAt(0).toUpperCase()}${tail.slice(1)}`,
  ];
  return openers[salt % openers.length];
}

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

function normalizeRoleKey(role: string, introTranscript?: string, industryHatId?: string): RolePoolKey {
  return resolveRolePoolKey(role, introTranscript, industryHatId) as RolePoolKey;
}

export function getFallbackRoast(
  name: string,
  role: string,
  intensity: Intensity,
  introTranscript?: string,
  attempt = 0,
  industryHatId?: string,
): RoastResult {
  const key = normalizeRoleKey(role, introTranscript, industryHatId);
  const used = getUsedRoasts();
  const pool = getTemplatePool(key, intensity, industryHatId);

  const parsed = introTranscript?.trim() ? parseIntro(introTranscript) : null;
  const who = parsed && parsed.name !== "friend" ? parsed.name : name;
  const roleLabel = parsed?.role ?? role;
  const company = parsed?.company;

  let roast: string;

  if (intensity === "nsfw") {
    const seed = attempt + Date.now() + name.length;
    roast = pickMeanModeRoast(who, key, seed);
    if (!isRoastRepetitive(roast, used)) {
      return {
        roast,
        violations: violationsForRoast(roast),
        fallback: true,
      };
    }
    if (attempt < 25) {
      return getFallbackRoast(name, role, intensity, introTranscript, attempt + 1, industryHatId);
    }
  }

  if (attempt < pool.length * 2) {
    const available = pool.filter((t) => {
      const filled = t.replace(/\{name\}/g, name);
      const candidate = introTranscript?.trim()
        ? personalizeFallback(who, roleLabel, company, filled, attempt)
        : filled;
      return !isRoastRepetitive(candidate, used);
    });
    const template =
      available[attempt % Math.max(available.length, 1)] ??
      pool[(attempt + Math.floor(Math.random() * pool.length)) % pool.length];

    roast = introTranscript?.trim()
      ? personalizeFallback(who, roleLabel, company, template.replace(/\{name\}/g, name), attempt)
      : template.replace(/\{name\}/g, name);
  } else {
    const seed = attempt + Date.now() + name.length;
    roast = generateCombinatorialRoast(name, intensity, seed, roleLabel);
    if (parsed && introTranscript?.trim()) {
      roast = personalizeFallback(who, roleLabel, parsed.company, roast, attempt);
    }
  }

  if (isRoastRepetitive(roast, used) && attempt < 40) {
    return getFallbackRoast(name, role, intensity, introTranscript, attempt + 1, industryHatId);
  }

  return {
    roast,
    violations: violationsForRoast(roast),
    fallback: true,
  };
}

function finalizeRoast(data: RoastResult): RoastResult {
  const roast = censorProfanityForShare(data.roast);
  const violations = violationsForRoast(roast, data.violations);
  return { ...data, roast, violations };
}

async function requestRoast(
  url: string,
  input: {
    name: string;
    role: string;
    company?: string;
    introTranscript?: string;
    industryHatId?: string;
    intensity: Intensity;
    safeMode: boolean;
    nsfwPin?: string;
    excludeRoasts?: string[];
    variationHint?: string;
  },
): Promise<RoastResult> {
  const industryContext = formatIndustryContextForPrompt(input.industryHatId);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, industryContext }),
  });
  if (!res.ok) throw new Error("roast failed");
  return (await res.json()) as RoastResult;
}

export async function fetchRoast(input: {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  industryHatId?: string;
  intensity: Intensity;
  safeMode: boolean;
  nsfwPin?: string;
}): Promise<RoastResult> {
  const outputs = await loadOutputs();
  const url = import.meta.env.VITE_ROAST_URL ?? outputs.custom?.roastUrl;
  const excludeRoasts = getUsedRoasts().slice(-150);

  const pickUnique = async (): Promise<RoastResult> => {
    if (!url) {
      return finalizeRoast(
        getFallbackRoast(
          input.name,
          input.role,
          input.intensity,
          input.introTranscript,
          0,
          input.industryHatId,
        ),
      );
    }

    const tried: string[] = [];
    for (let attempt = 0; attempt < 8; attempt++) {
      const data = finalizeRoast(
        await requestRoast(url, {
          ...input,
          excludeRoasts: [...excludeRoasts, ...tried],
          variationHint: CREATIVE_ANGLES[(attempt + input.name.length) % CREATIVE_ANGLES.length],
          industryHatId: input.industryHatId,
        }),
      );
      if (!isRoastRepetitive(data.roast, [...excludeRoasts, ...tried])) {
        return data;
      }
      tried.push(data.roast);
    }

    return finalizeRoast(
      getFallbackRoast(
        input.name,
        input.role,
        input.intensity,
        input.introTranscript,
        tried.length,
        input.industryHatId,
      ),
    );
  };

  try {
    const data = await pickUnique();
    markRoastUsed(data.roast);
    return data;
  } catch {
    const data = finalizeRoast(
      getFallbackRoast(
        input.name,
        input.role,
        input.intensity,
        input.introTranscript,
        0,
        input.industryHatId,
      ),
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
