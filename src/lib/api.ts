import type { Intensity, RoastResult } from "../types";
import { formatIndustryContextForPrompt, getIndustryHatBurns } from "../content/industry/hatBurns";
import { getRoastAnglesForHat } from "../content/industry/hatArchetypes";
import { pickMeanModeRoast } from "../content/mean-mode-roasts";
import { getTemplatePool, type RolePoolKey } from "../content/roast-pools";
import { resolveRolePoolKey, parseIntro } from "./parseIntro";
import { violationsForRoast } from "./deriveViolations";
import { censorProfanityForShare } from "./profanityCensor";
import { getUsedRoasts, markRoastUsed } from "./roastHistory";
import {
  CREATIVE_ANGLES,
  generateCombinatorialRoast,
  isRoastRepetitive,
} from "./roastVariety";
import { normalizeRoastDelivery, type RoastDeliveryContext } from "./roastDelivery";
import { resolveRoastUrl, resolveSpeakUrl } from "./amplifyOutputs";

export { resolveRoastUrl, resolveSpeakUrl } from "./amplifyOutputs";

function normalizeRoleKey(role: string, introTranscript?: string, industryHatId?: string): RolePoolKey {
  return resolveRolePoolKey(role, introTranscript, industryHatId) as RolePoolKey;
}

function pickFromCandidates(candidates: string[], used: string[], attempt: number): string | null {
  const fresh = candidates.filter((c) => !isRoastRepetitive(c, used));
  if (fresh.length) return fresh[attempt % fresh.length];
  if (candidates.length) return candidates[attempt % candidates.length];
  return null;
}

export function getFallbackRoast(
  name: string,
  role: string,
  intensity: Intensity,
  introTranscript?: string,
  attempt = 0,
  industryHatId?: string,
): RoastResult {
  const parsed = introTranscript?.trim() ? parseIntro(introTranscript) : null;
  const who = parsed && parsed.name !== "friend" ? parsed.name : name;
  const roleLabel = parsed?.role ?? role;
  const hatId = industryHatId ?? parsed?.industryHatId;
  const key = normalizeRoleKey(roleLabel, introTranscript, hatId);
  const used = getUsedRoasts();
  const seed = attempt + Date.now() + who.length;

  const candidates: string[] = [];

  if (hatId) {
    candidates.push(...getIndustryHatBurns(hatId, intensity, who, seed));
  }

  if (intensity === "nsfw") {
    candidates.unshift(pickMeanModeRoast(who, key, seed));
  }

  const pool = getTemplatePool(key, intensity, hatId).map((t) => t.replace(/\{name\}/g, who));
  candidates.push(...pool);

  const picked = pickFromCandidates(candidates, used, attempt);
  if (picked && !isRoastRepetitive(picked, used)) {
    return {
      roast: picked,
      violations: violationsForRoast(picked),
      fallback: true,
    };
  }

  if (attempt < 40) {
    return getFallbackRoast(name, role, intensity, introTranscript, attempt + 1, industryHatId);
  }

  const roast =
    generateCombinatorialRoast(who, intensity, seed, roleLabel) ||
    `Hi ${who}! ${roleLabel} — your project habits are giving the whole trade trust issues.`;

  return {
    roast,
    violations: violationsForRoast(roast),
    fallback: true,
  };
}

function deliveryContext(input: {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  intensity: Intensity;
}): RoastDeliveryContext {
  const parsed = input.introTranscript?.trim() ? parseIntro(input.introTranscript) : null;
  return {
    name: parsed?.name ?? input.name,
    role: parsed?.role ?? input.role,
    company: parsed?.company ?? input.company,
    introTranscript: input.introTranscript,
    intensity: input.intensity,
  };
}

function finalizeRoast(
  data: RoastResult,
  ctx: RoastDeliveryContext,
): RoastResult {
  let roast = normalizeRoastDelivery(data.roast, ctx);
  roast = censorProfanityForShare(roast);
  const violations = violationsForRoast(roast, data.violations);
  return { ...data, roast, violations };
}

function buildRoastPayload(input: {
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
}) {
  const parsed = input.introTranscript?.trim() ? parseIntro(input.introTranscript) : null;
  const roleForApi = parsed?.rolePrompt ?? input.role;
  const company = parsed?.company ?? input.company;
  const industryHatId = input.industryHatId ?? parsed?.industryHatId;
  const industryContext = formatIndustryContextForPrompt(industryHatId);

  return {
    ...input,
    name: parsed?.name && parsed.name !== "friend" ? parsed.name : input.name,
    role: roleForApi,
    company,
    industryHatId,
    industryContext,
  };
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
  const body = buildRoastPayload(input);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("roast failed");
  const data = (await res.json()) as RoastResult;
  return { ...data, fallback: data.fallback ?? false };
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
  const url = await resolveRoastUrl();
  const excludeRoasts = getUsedRoasts().slice(-150);
  const delivery = deliveryContext(input);

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
        delivery,
      );
    }

    const hatAngles = getRoastAnglesForHat(input.industryHatId);
    const anglePool = hatAngles.length > 0 ? hatAngles : CREATIVE_ANGLES;

    const tried: string[] = [];
    for (let attempt = 0; attempt < 8; attempt++) {
      const data = finalizeRoast(
        await requestRoast(url, {
          ...input,
          excludeRoasts: [...excludeRoasts, ...tried],
          variationHint: anglePool[(attempt + input.name.length) % anglePool.length],
        }),
        delivery,
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
      delivery,
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
      delivery,
    );
    markRoastUsed(data.roast);
    return data;
  }
}

export async function fetchSpeech(text: string): Promise<ArrayBuffer | null> {
  const url = await resolveSpeakUrl();

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
