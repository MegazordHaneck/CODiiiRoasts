import type { RolePoolKey } from "../roast-pools";

/** Map hat id → coarse roast pool (existing pools + extensions). */
const HAT_ID_POOL: Partial<Record<string, RolePoolKey>> = {
  architect: "architect",
  interior_designer: "architect",
  landscape_architect: "civil",
  lighting_designer: "mep",
  specifications_writer: "specifier",
  structural_engineer: "engineer",
  civil_engineer: "civil",
  geotechnical_engineer: "civil",
  survey_engineer: "civil",
  traffic_engineer: "civil",
  mechanical_engineer: "mep",
  electrical_engineer: "mep",
  plumbing_engineer: "mep",
  fire_protection_engineer: "mep",
  bim_vdc_coordinator: "bim manager",
  sustainability_consultant: "sustainability",
  building_envelope_consultant: "envelope",
  commissioning_authority: "commissioning",
  code_consultant: "regulatory",
  ahj_plan_reviewer: "regulatory",
  heritage_officer: "regulatory",
  accessibility_reviewer: "regulatory",
  environmental_consultant: "regulatory",
  owner_representative: "owner",
  owners_project_manager: "pm",
  lender_inspector: "owner",
  leasing_property: "owner",
  estimator: "estimator",
  scheduler: "pm",
  procurement_contracts: "pm",
  preconstruction_manager: "gc",
  construction_manager: "gc",
  superintendent: "superintendent",
  site_safety: "superintendent",
  quality_control: "gc",
  layout_engineer_field: "engineer",
  excavation_earthwork: "civil",
  utilities_earthwork_site: "civil",
  paving_asphalt_concrete: "civil",
  landscape_install: "civil",
  irrigation_contractor: "civil",
  demolition_contractor: "contractor",
  abatement_hazmat: "contractor",
  facility_management: "owner",
  building_operator: "owner",
  hvac_mechanical_contractor: "mep_trade",
  plumbing_mechanical_contractor: "mep_trade",
  electrical_contractor: "mep_trade",
  sheet_metal_hvac: "mep_trade",
  sprinkler_contractor: "mep_trade",
  fire_alarm_contractor: "mep_trade",
  controls_bms: "mep_trade",
  tab_contractor: "mep_trade",
  glazing_curtainwall: "envelope",
  roofing_contractor: "envelope",
  cladding_contractor: "envelope",
  structural_steel_erector: "contractor",
  concrete_placement: "contractor",
  rebar_contractor: "contractor",
  elevator_contractor: "contractor",
};

const HAT_GROUP_POOL: Record<string, RolePoolKey> = {
  design_consultant: "architect",
  engineering_consultant: "engineer",
  specialty_consultant: "engineer",
  stakeholder: "owner",
  regulatory: "regulatory",
  preconstruction: "gc",
  gc_field: "gc",
  structural_site_trade: "contractor",
  envelope_trade: "envelope",
  interior_trade: "contractor",
  mep_trade: "mep_trade",
  mep_subtrade: "mep_trade",
  fire_protection_trade: "mep_trade",
  conveyance_specialty: "contractor",
  site_civil_trade: "civil",
  demolition_abatement: "contractor",
  operations: "owner",
};

export function rolePoolKeyForHat(hatId: string | undefined, hatGroup: string | undefined): RolePoolKey {
  if (hatId && HAT_ID_POOL[hatId]) return HAT_ID_POOL[hatId]!;
  if (hatGroup && HAT_GROUP_POOL[hatGroup]) return HAT_GROUP_POOL[hatGroup];
  return "default";
}

export function rolePoolKeyFromText(role: string, transcript?: string): RolePoolKey {
  const text = `${role} ${transcript ?? ""}`.toLowerCase();
  if (text.includes("architect") && !text.includes("landscape")) return "architect";
  if (text.includes("landscape")) return "civil";
  if (text.includes("structural")) return "engineer";
  if (text.includes("civil")) return "civil";
  if (text.includes("geotech")) return "civil";
  if (text.includes("mechanical") || text.includes("hvac")) return "mep";
  if (text.includes("electrical") || text.includes("electrician")) return "mep_trade";
  if (text.includes("plumb")) return "mep";
  if (text.includes("sprinkler") || text.includes("fire alarm")) return "mep_trade";
  if (text.includes("bim") || text.includes("vdc")) return "bim manager";
  if (text.includes("superintendent") || text.includes("super")) return "superintendent";
  if (text.includes("estimat")) return "estimator";
  if (text.includes("commissioning") || text.includes("cxa")) return "commissioning";
  if (text.includes("ahj") || text.includes("plan review")) return "regulatory";
  if (text.includes("leed") || text.includes("sustainability")) return "sustainability";
  if (text.includes("curtain wall") || text.includes("envelope")) return "envelope";
  if (text.includes("specifier") || text.includes("spec writer")) return "specifier";
  if (text.includes("general contractor") || text === "gc") return "gc";
  if (text.includes("contractor")) return "contractor";
  if (text.includes("owner")) return "owner";
  if (text.includes("project manager") || text.includes(" pm")) return "pm";
  if (text.includes("engineer")) return "engineer";
  return "default";
}
