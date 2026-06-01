import { matchIndustryHat } from "../content/industry/matchHat";
import { rolePoolKeyForHat, rolePoolKeyFromText } from "../content/industry/rolePoolMap";

/** Extract structured fields from spoken intro (best-effort). */
export function parseIntro(transcript: string): {
  name: string;
  role: string;
  company?: string;
  industryHatId?: string;
  industryHatLabel?: string;
  /** One-line summary for API / display */
  summary: string;
} {
  const text = transcript.trim().replace(/\s+/g, " ");
  let name = "friend";
  let role = "AEC professional";
  let company: string | undefined;

  const nameMatch =
    text.match(/(?:my name is|i'm|i am|call me|name's)\s+([A-Za-z][A-Za-z'-]{0,30})/i) ??
    text.match(/(?:hey codiii,?|hi codiii,?|hello)\s*(?:my name is)?\s*([A-Za-z][A-Za-z'-]{0,30})/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
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
    role = formatRolePhrase(verb, object);
  } else {
    const amMatch = text.match(/\bi(?:'m| am)\s+(?:a|an)\s+([^.!?]{3,70})/i);
    if (amMatch) {
      role = amMatch[1].trim();
    } else {
      const workAs = text.match(/\b(?:work as|working as|job is|role is)\s+([^.!?]{3,70})/i);
      if (workAs) role = workAs[1].trim();
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
  if (role.length < 3) role = "AEC professional";

  const hat = matchIndustryHat(text);
  if (hat && (role === "AEC professional" || role.length < 12)) {
    role = hat.label;
  }

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
    industryHatId: hat?.hatId,
    industryHatLabel: hat?.label,
    summary,
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

function formatRolePhrase(verb: string, object: string): string {
  const obj = object.replace(/^(the|a|an)\s+/i, "").trim();
  if (/architect/i.test(obj)) return obj.includes("architect") ? obj : `${obj} architect`;
  if (verb === "design" && /bridge/i.test(obj)) return "bridge designer";
  if (verb === "design") return `designs ${obj}`;
  if (verb === "build") return `builds ${obj}`;
  if (verb === "manage") return `manages ${obj}`;
  if (verb === "engineer") return `engineers ${obj}`;
  if (verb === "coordinate") return `coordinates ${obj}`;
  if (verb === "specify") return `specifies ${obj}`;
  return `${verb}s ${obj}`;
}
