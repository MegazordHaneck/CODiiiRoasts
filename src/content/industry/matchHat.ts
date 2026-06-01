import { HAT_BY_ID, HATS, type IndustryHat } from "./loadHats";

export type HatMatch = {
  hatId: string;
  label: string;
  hatGroup: string;
};

function scoreHat(text: string, hat: IndustryHat): number {
  const t = text.toLowerCase();
  let score = 0;

  const label = hat.label.toLowerCase();
  if (t.includes(label)) score += 12;

  for (const kw of hat.keywords) {
    const k = kw.toLowerCase();
    if (k.length < 3) continue;
    if (t.includes(k)) score += 4;
  }

  const idPhrase = hat.id.replace(/_/g, " ");
  if (t.includes(idPhrase)) score += 8;

  // Common spoken aliases
  const aliases: Record<string, string[]> = {
    architect: ["architect", "architecture"],
    structural_engineer: ["structural engineer", "structural", "bridge designer", "designs bridges", "bridges"],
    civil_engineer: ["civil engineer", "civil", "highway", "roadway"],
    mechanical_engineer: ["mechanical engineer", "mechanical design"],
    electrical_engineer: ["electrical engineer"],
    plumbing_engineer: ["plumbing engineer"],
    bim_vdc_coordinator: ["bim manager", "vdc", "bim coordinator"],
    superintendent: ["superintendent", "super"],
    construction_manager: ["construction manager", "cm ", " cm,"],
    specifications_writer: ["specifier", "spec writer", "specifications"],
    sustainability_consultant: ["leed", "sustainability", "well consultant"],
    commissioning_authority: ["commissioning", "cxa", "cx agent"],
    ahj_plan_reviewer: ["ahj", "plan reviewer", "building official"],
    estimator: ["estimator", "estimating"],
    scheduler: ["scheduler", "planning engineer"],
    hvac_mechanical_contractor: ["hvac contractor", "mechanical contractor"],
    electrical_contractor: ["electrical contractor", "electrician"],
    plumbing_mechanical_contractor: ["plumbing contractor", "plumber"],
    glazing_curtainwall: ["curtain wall", "glazing contractor"],
    roofing_contractor: ["roofer", "roofing contractor"],
    fire_protection_engineer: ["fire protection", "sprinkler design"],
    sprinkler_contractor: ["sprinkler contractor", "fire sprinkler"],
    geotechnical_engineer: ["geotechnical", "geotech"],
    landscape_architect: ["landscape architect"],
    interior_designer: ["interior designer"],
    owners_project_manager: ["owner's pm", "owners project manager", "opm"],
    owner_representative: ["owner rep", "owner representative"],
    preconstruction_manager: ["precon", "preconstruction"],
    tab_contractor: ["tab contractor", "testing adjusting balancing"],
    controls_bms: ["controls contractor", "bms", "building automation"],
  };

  const extra = aliases[hat.id];
  if (extra) {
    for (const a of extra) {
      if (t.includes(a)) score += 6;
    }
  }

  return score;
}

/** Best-matching industry hat from intro / role text (AECOHats.mjs). */
export function matchIndustryHat(text: string): HatMatch | null {
  const t = text.trim();
  if (!t) return null;

  let best: { hat: IndustryHat; score: number } | null = null;

  for (const hat of HATS) {
    const score = scoreHat(t, hat);
    if (score < 4) continue;
    if (!best || score > best.score) best = { hat, score };
  }

  if (!best) return null;

  return {
    hatId: best.hat.id,
    label: best.hat.label,
    hatGroup: best.hat.hatGroup,
  };
}

export function getIndustryHat(hatId: string | undefined): IndustryHat | null {
  if (!hatId) return null;
  return HAT_BY_ID[hatId] ?? null;
}
