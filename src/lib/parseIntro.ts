/** Extract structured fields from spoken intro (best-effort). */
export function parseIntro(transcript: string): {
  name: string;
  role: string;
  company?: string;
} {
  const text = transcript.trim();
  let name = "friend";
  let role = "AEC professional";
  let company: string | undefined;

  const nameMatch =
    text.match(/(?:my name is|i'm|i am|call me|name's)\s+([A-Za-z][A-Za-z\s'-]{0,40})/i) ??
    text.match(/(?:hey codiii,?|hi codiii,?)\s*(?:my name is)?\s*([A-Za-z][A-Za-z'-]{0,30})/i);
  if (nameMatch) {
    name = nameMatch[1].split(/\s+(?:from|at|and|i|who)/i)[0].trim();
  }

  const companyMatch =
    text.match(/(?:from|at|with|company is)\s+([A-Za-z0-9][A-Za-z0-9\s&.'-]{1,50})/i);
  if (companyMatch) {
    company = companyMatch[1]
      .replace(/\s+(?:and|i|where|who).*$/i, "")
      .trim();
  }

  const roleMatch =
    text.match(/(?:i am a|i'm a|work as|working as|role is|job is)\s+([^.!?]{3,60})/i) ??
    text.match(/(?:and i|,\s*i)\s+(design|build|manage|coordinate|specify|engineer|architect)[^.!?]*/i);
  if (roleMatch) {
    role = roleMatch[1].trim();
  } else if (/architect/i.test(text)) role = "Architect";
  else if (/bim/i.test(text)) role = "BIM Manager";
  else if (/engineer/i.test(text)) role = "Engineer";
  else if (/contractor|general contractor|gc\b/i.test(text)) role = "Contractor";
  else if (/project manager|pm\b/i.test(text)) role = "Project Manager";
  else if (/owner|developer/i.test(text)) role = "Owner";

  return { name, role, company };
}
