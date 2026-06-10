import type { IndustryHat } from "./loadHats";
import { HAT_ARCHETYPE_GUIDES } from "./hatArchetypeGuides";
import { getIndustryHat } from "./matchHat";

export type HatArchetypeGuide = {
  /** One-line identity — who they actually are on a job */
  archetype: string;
  /** Day-to-day pain points to roast (their work product, not adjacent roles) */
  grillOn: string[];
  /** Stereotypes that belong to OTHER hats — do not attribute to this person */
  avoid: string[];
  /** Role-specific creative angles for the API */
  angles: string[];
};

/** Fallback when a hat id is missing from HAT_ARCHETYPE_GUIDES (should not happen). */
const HAT_GROUP_ARCHETYPES: Record<string, HatArchetypeGuide> = {
  design_consultant: {
    archetype: "Design author — drawings, specs, design intent, client-facing aesthetics.",
    grillOn: ["revision clouds", "render vs built", "detail constructibility", "coordination gaps"],
    avoid: ["BIM clash matrices", "superintendent field reports", "buyout spreadsheets"],
    angles: ["Render vs built — classic split personality."],
  },
  engineering_consultant: {
    archetype: "Technical consultant — calcs, stamped drawings, discipline engineering deliverables.",
    grillOn: ["stamp Friday", "SEE STRUCTURAL", "calcs vs sheet mismatch", "verify in field"],
    avoid: ["architect render aesthetics", "Navisworks clashes", "superintendent daily"],
    angles: ["Calcs are church — sheet is fan fiction."],
  },
  specialty_consultant: {
    archetype: "Niche consultant — specialty reports, late-invite expertise, narrow deliverables.",
    grillOn: ["long report vs one detail", "late coordination", "scope gaps"],
    avoid: ["GC schedule fiction", "field mobilization", "BIM LOD decks"],
    angles: ["Report is a novel — detail is TBD."],
  },
  stakeholder: {
    archetype: "Owner-side — budget, approvals, program, risk appetite.",
    grillOn: ["vision vs budget", "scope creep emails", "approval latency"],
    avoid: ["Revit families", "field rough-in", "stamping drawings"],
    angles: ["Iconic vision — strip-mall budget."],
  },
  regulatory: {
    archetype: "Code / AHJ / reviewer — permits, comments, compliance gatekeeping.",
    grillOn: ["comment letter volume", "resubmittal cycles", "code interpretation holds"],
    avoid: ["Revit modeling", "buyout", "field install quality as their job"],
    angles: ["Final boss of entitlement."],
  },
  preconstruction: {
    archetype: "Precon — estimating, buyout, bid leveling, assumptions.",
    grillOn: ["buyout optimism", "assumption log", "bid spread shock"],
    avoid: ["Navisworks sessions", "daily superintendent reports", "stamping calcs"],
    angles: ["We assumed — famous last words."],
  },
  gc_field: {
    archetype: "Field / CM leadership — schedule, trades, site execution, OAC.",
    grillOn: ["float ghosted", "recovery fiction", "RFI backlog", "lookahead astrology"],
    avoid: ["architect renderings", "LOD slide decks (unless BIM hat)", "stamping drawings"],
    angles: ["Back on track — never was on track."],
  },
  structural_site_trade: {
    archetype: "Structural / earth / concrete trade — install, tolerance, field coordination.",
    grillOn: ["wrong revision mobilization", "waiting on design", "tolerance fights", "as-built fiction"],
    avoid: ["Division 08 specs", "BEP", "AHJ plan check"],
    angles: ["Mobilized on sheet that lied."],
  },
  envelope_trade: {
    archetype: "Envelope trade — waterproofing, cladding, glazing, continuity.",
    grillOn: ["air barrier gaps", "flashing laps", "deflection surprises", "water intrusion"],
    avoid: ["Navisworks", "structural stamp", "owner program"],
    angles: ["Water found the gap."],
  },
  interior_trade: {
    archetype: "Interior trade — drywall, ceilings, finishes, blocking.",
    grillOn: ["ceiling height lie", "blocking missing", "as-shown scope", "finish vs substrate"],
    avoid: ["structural SEE notes", "permit entitlement", "geotech report"],
    angles: ["Ceiling grid level — height wasn't."],
  },
  mep_trade: {
    archetype: "MEP installing contractor — rough-in, equipment, duct/pipe in the building.",
    grillOn: ["plenum war", "rough-in interference", "submittal or-equal", "TAB truth"],
    avoid: ["MEP engineering calcs", "owner vision slides", "Division 01 spec writing"],
    angles: ["Plenum dreams died here."],
  },
  mep_subtrade: {
    archetype: "MEP sub-trade — specialty systems after others claimed space.",
    grillOn: ["late in plenum", "integration blame", "specialty submittals"],
    avoid: ["GC master schedule", "architect render", "geotech report"],
    angles: ["Last in plenum — first in blame chain."],
  },
  fire_protection_trade: {
    archetype: "Fire protection installer — sprinklers, standpipe, special suppression.",
    grillOn: ["head layout vs ceiling", "hydraulic vs field", "AHJ inspection", "access panels"],
    avoid: ["landscape planting", "BIM LOD", "owner leasing"],
    angles: ["Hydraulics fine — ceiling isn't."],
  },
  conveyance_specialty: {
    archetype: "Elevator / escalator — shafts, pits, shop drawings, tolerances.",
    grillOn: ["pit dimensions", "shaft coordination late", "shop drawing lag", "startup delays"],
    avoid: ["roofing laps", "civil inverts", "specifier doors"],
    angles: ["Shaft coordinated — in a dream."],
  },
  site_civil_trade: {
    archetype: "Site / civil trade — grading, utilities, paving, drainage.",
    grillOn: ["grading vs rain", "invert lies", "utility conflict", "compaction drama"],
    avoid: ["interior millwork", "sprinkler hydraulics", "curtain wall"],
    angles: ["Invert spot lied — camera didn't."],
  },
  demolition_abatement: {
    archetype: "Demo / abatement — selective demo, hazmat, surprises.",
    grillOn: ["as-built fiction", "abatement surprises", "design on A-101", "containment"],
    avoid: ["LEED credits", "BIM federation", "lender draw only"],
    angles: ["Behind the wall: plot twist."],
  },
  operations: {
    archetype: "FM / building operator — O&M, warranties, inherited design sins.",
    grillOn: ["O&M manual vs reality", "warranty claims", "Monday fires", "BAS troubleshooting"],
    avoid: ["buyout optimism", "stamping engineering", "clash naming"],
    angles: ["You inherit every design sin."],
  },
};

function enrichFromHatMetadata(guide: HatArchetypeGuide, hat: IndustryHat): HatArchetypeGuide {
  const grillOn = [...guide.grillOn];
  if (hat.description && !grillOn.includes(hat.description)) {
    grillOn.unshift(hat.description);
  }
  const expandedGrillHats = new Set([
    "architect",
    "bim_vdc_coordinator",
    "structural_engineer",
    "mechanical_engineer",
    "superintendent",
    "construction_manager",
    "owners_project_manager",
  ]);
  const grillCap = expandedGrillHats.has(hat.id) ? 28 : 12;
  return {
    ...guide,
    grillOn: [...new Set(grillOn)].slice(0, grillCap),
  };
}

export function resolveHatArchetype(hat: IndustryHat): HatArchetypeGuide {
  const dedicated = HAT_ARCHETYPE_GUIDES[hat.id];
  if (dedicated) {
    return enrichFromHatMetadata(dedicated, hat);
  }

  const group = HAT_GROUP_ARCHETYPES[hat.hatGroup] ?? HAT_GROUP_ARCHETYPES.design_consultant;
  const kwGrill = hat.keywords
    .filter((k) => k.length > 2)
    .slice(0, 4)
    .map((k) => `${k} deliverable pain`);
  return enrichFromHatMetadata(
    {
      ...group,
      grillOn: [...new Set([...group.grillOn, ...kwGrill])],
    },
    hat,
  );
}

export function formatHatArchetypeBlock(hat: IndustryHat): string {
  const g = resolveHatArchetype(hat);
  const lines = [
    "=== ROLE FIDELITY (mandatory) ===",
    `Hat: ${hat.label} [${hat.id} / ${hat.hatGroup}]`,
    `Archetype: ${g.archetype}`,
    `GRILL THEM ON (their actual job): ${g.grillOn.join("; ")}.`,
    `DO NOT roast as (wrong hat): ${g.avoid.join("; ")}.`,
    `Punchline energy (do not copy verbatim): ${g.angles.join(" | ")}`,
    "The roast must sound like an insider mocking THIS hat — not a generic AEC burn or an adjacent discipline.",
  ];
  const varietyHints: Record<string, string> = {
    architect:
      "VARIETY: Pick a DIFFERENT trope each roast — rotate across stairs, curtain wall, ceiling height, door hardware, VE, site visits, charrettes, sheet index, waterproofing, cantilever, RCP tricks, punch list language, etc. Do not default to render-vs-headroom every time.",
    bim_vdc_coordinator:
      "VARIETY: Rotate across LOD slides, clash reports, BEP fiction, federated model divorce, issue tracker theater, Revit crashes, 4D vs field, IFC handoffs, clash names — not the same LOD joke every roast.",
    structural_engineer:
      "VARIETY: Rotate across SEE STRUCTURAL, Friday stamp, verify-in-field, pin connections, calcs vs sheet, steel detailer deferrals, deflection, connection details, sketch-on-PDF — not the same stamp joke every roast.",
    mechanical_engineer:
      "VARIETY: Rotate across plenum war, ceiling height lie, equipment schedule, Copy of Copy of Duct, RCP hide-and-seek, load calcs vs VE, panel room size, NOT FOR CONSTRUCTION — not the same plenum joke every roast.",
    superintendent:
      "VARIETY: Rotate across daily report waiting-on-design, RFI photos, tape measure vs sketch, sequence vs weather, toolbox talk, field sketch art, mobilized on wrong sheet — not the same RFI joke every roast.",
    construction_manager:
      "VARIETY: Rotate across meetings-about-meetings, Gantt astrology, RAID screams DESIGN, blame matrix, recovery narrative, float ghosted, lookahead fiction — not the same meeting joke every roast.",
    owners_project_manager:
      "VARIETY: Rotate across stakeholder alignment fiction, change review loops, budget spreadsheet vs reality, vendor coordination, owner directive translation — not the same budget joke every roast.",
  };
  const variety = varietyHints[hat.id];
  if (variety) lines.push(variety);
  return lines.join("\n");
}

export function getRoastAnglesForHat(hatId: string | undefined): string[] {
  const hat = getIndustryHat(hatId);
  if (!hat) return [];
  return resolveHatArchetype(hat).angles;
}

/** Coverage check for admin / tests */
export function hatArchetypeCoverage(hatIds: string[]): { covered: number; missing: string[] } {
  const missing = hatIds.filter((id) => !HAT_ARCHETYPE_GUIDES[id]);
  return { covered: hatIds.length - missing.length, missing };
}
