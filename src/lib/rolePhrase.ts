/** True when role looks like "designs bridges" instead of a job title. */
export function isVerbPhraseRole(role: string): boolean {
  return /^(designs|builds|manages|engineers|coordinates|specifies|develops|leads|runs|draws|drafts)\s+/i.test(
    role.trim(),
  );
}

/**
 * Turn "I design skyscrapers" into a speakable profession (noun phrase), not "designs skyscrapers".
 */
export function professionFromDesignWork(verb: string, object: string): string {
  const obj = object.replace(/^(the|a|an)\s+/i, "").trim();
  const lower = obj.toLowerCase();

  if (/architect/i.test(obj)) return obj.includes("architect") ? obj : `${obj} architect`;
  if (verb === "design" && /skyscraper|high[\s-]?rise|tower|supertall/i.test(lower)) return "high-rise architect";
  if (verb === "design" && /bridge/i.test(lower)) return "bridge designer";
  if (verb === "design" && /building|facade|mixed.?use|campus/i.test(lower)) return "architect";
  if (verb === "design" && /interior|space/i.test(lower)) return "interior designer";
  if (verb === "design") {
    const noun = obj.replace(/ies$/i, "y").replace(/s$/i, "");
    return `${noun} designer`;
  }
  if (verb === "build" && /home|house|residential/i.test(lower)) return "home builder";
  if (verb === "build") return "general contractor";
  if (verb === "manage" && /project|construction/i.test(lower)) return "project manager";
  if (verb === "manage") return "construction manager";
  if (verb === "engineer") return `${obj.replace(/s$/i, "")} engineer`;
  if (verb === "coordinate" && /bim|vdc/i.test(lower)) return "BIM / VDC coordinator";
  if (verb === "coordinate") return "design coordinator";
  if (verb === "specify") return "specifier";
  return `${verb}s ${obj}`;
}

/** What they said they do — for LLM context, e.g. "designs skyscrapers". */
export function workDetailFromVerb(verb: string, object: string): string {
  const obj = object.replace(/^(the|a|an)\s+/i, "").trim();
  const v = verb.toLowerCase();
  if (v === "design") return `designs ${obj}`;
  if (v === "build") return `builds ${obj}`;
  if (v === "manage") return `manages ${obj}`;
  if (v === "engineer") return `engineers ${obj}`;
  return `${v}s ${obj}`;
}

/** Single string for API / display — never "a designs skyscrapers". */
export function roleForPrompt(parts: {
  role: string;
  company?: string;
  workDetail?: string;
  industryHatLabel?: string;
}): string {
  const title = parts.industryHatLabel?.trim() || parts.role.trim();
  const work = parts.workDetail?.trim();
  let line = title;
  if (work && !title.toLowerCase().includes(work.replace(/^designs?\s+/i, "").slice(0, 8))) {
    line = `${title} who ${work}`;
  }
  if (parts.company?.trim()) {
    line = `${line} at ${parts.company.trim()}`;
  }
  return line;
}

/** Strip parser artifacts like trailing "from". */
export function cleanAttendeeName(name: string): string {
  return name
    .trim()
    .replace(/\s+from$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}
