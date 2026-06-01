import { matchIndustryHat } from "../content/industry/matchHat";
import { rolePoolKeyForHat, rolePoolKeyFromText } from "../content/industry/rolePoolMap";
import { isVerbPhraseRole, professionFromDesignWork, roleForPrompt, workDetailFromVerb, cleanAttendeeName } from "./rolePhrase";

/** Extract structured fields from spoken intro (best-effort). */
export function parseIntro(transcript: string): {
  name: string;
  role: string;
  company?: string;
  workDetail?: string;
  industryHatId?: string;
  industryHatLabel?: string;
  /** One-line summary for API / display */
  summary: string;
  /** Profession + work + company — safe for LLM and UI */
  rolePrompt: string;
} {
  const text = transcript.trim().replace(/\s+/g, " ");
  let name = "friend";
  let role = "AEC professional";
  let company: string | undefined;
  let workDetail: string | undefined;

  const nameMatch =
    text.match(
      /(?:my name is|i'm|i am|call me|name's)\s+([A-Za-z][A-Za-z'-]+(?:\s+[A-Za-z][A-Za-z'-]+)*?)(?=\s+from\b|\s*,\s*and\s+|\s+and\s+i\s|\s+i\s+(?:design|build|manage|engineer|work|am)\b|$)/i,
    ) ?? text.match(/(?:hey codiii,?|hi codiii,?|hello)\s*(?:my name is)?\s*([A-Za-z][A-Za-z'-]+)/i);
  if (nameMatch) {
    name = cleanAttendeeName(nameMatch[1].trim());
  }

  const companyMatch =
    text.match(/\bfrom\s+([A-Za-z0-9][A-Za-z0-9\s&.'-]{1,48}?)(?=\s+and\s+|\s*,\s*and\s+|\s+i\s+|$)/i) ??
    text.match(/\bat\s+([A-Za-z0-9][A-Za-z0-9\s&.'-]{1,48}?)(?=\s+and\s+|\s*,|$)/i) ??
    text.match(/\bwith\s+([A-Za-z0-9][A-Za-z0-9\s&.'-]{1,48}?)(?=\s+and\s+|$)/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }

  const livingMatch = text.match(
    /\bi\s+(design|build|manage|engineer|coordinate|specify|develop|lead|run|draw|draft)\s+([^.!?]{2,60}?)(?:\s+for\s+a\s+living|\s+for\s+living|\.|,|$)/i,
  );
  if (livingMatch) {
    const verb = livingMatch[1].toLowerCase();
    const object = livingMatch[2].trim();
    workDetail = workDetailFromVerb(verb, object);
    role = professionFromDesignWork(verb, object);
  } else {
    const amMatch = text.match(/\bi(?:'m| am)\s+(?:a|an)\s+([^.!?]{3,70})/i);
    if (amMatch) {
      role = amMatch[1].trim();
    } else {
      const workAs = text.match(/\b(?:work as|working as|job is|role is)\s+([^.!?]{3,70})/i);
      if (workAs) role = workAs[1].trim();
      else if (/skyscraper|high[\s-]?rise/i.test(text) && /design/i.test(text)) role = "high-rise architect";
      else if (/bridge/i.test(text) && /design/i.test(text)) role = "bridge designer";
      else if (/architect/i.test(text)) role = "architect";
      else if (/\bbim\b/i.test(text)) role = "BIM manager";
      else if (/structural/i.test(text)) role = "structural engineer";
      else if (/engineer/i.test(text)) role = "engineer";
      else if (/contractor|general contractor|\bgc\b/i.test(text)) role = "general contractor";
      else if (/project manager|\bpm\b/i.test(text)) role = "project manager";
      else if (/owner|developer/i.test(text)) role = "owner/developer";
      else if (/specifier|spec writer/i.test(text)) role = "specifier";
    }
  }

  role = role.replace(/\s+for\s+a\s+living$/i, "").trim();
  if (isVerbPhraseRole(role)) {
    const m = role.match(/^(\w+)\s+(.+)$/i);
    if (m) role = professionFromDesignWork(m[1], m[2]);
  }
  if (role.length < 3) role = "AEC professional";

  const hat = matchIndustryHat(text);
  if (
    hat &&
    (role === "AEC professional" ||
      role.length < 12 ||
      isVerbPhraseRole(role) ||
      /designer$/i.test(role))
  ) {
    if (/architect/i.test(hat.label) || hat.hatId === "architect") {
      role = hat.label;
    } else if (role === "AEC professional" || isVerbPhraseRole(role)) {
      role = hat.label;
    }
  }

  const rolePrompt = roleForPrompt({
    role,
    company,
    workDetail,
    industryHatLabel: hat?.label,
  });

  const summary = [
    name,
    company ? `from ${company}` : null,
    role !== "AEC professional" ? `— ${role}` : null,
    hat ? `(${hat.hatGroup.replace(/_/g, " ")})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    name,
    role,
    company,
    workDetail,
    industryHatId: hat?.hatId,
    industryHatLabel: hat?.label,
    summary,
    rolePrompt,
  };
}

/** Coarse roast pool key using industry hats when available. */
export function resolveRolePoolKey(role: string, transcript?: string, industryHatId?: string): string {
  const hat = matchIndustryHat(`${role} ${transcript ?? ""}`);
  const hatId = industryHatId ?? hat?.hatId;
  const hatGroup = hat?.hatGroup;
  const fromHat = rolePoolKeyForHat(hatId, hatGroup);
  if (fromHat !== "default") return fromHat;
  return rolePoolKeyFromText(role, transcript);
}
