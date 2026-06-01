/**
 * Review / work "hats" for model presentation (lenses).
 * Covers consultants, trades, and sub-trades (no external classification codes).
 *
 * Aligns with AECOClassifier.mjs:
 *   - docClassFocus → keys of DOC_CLASS_SIGNALS
 *   - disciplineFocus → keys of DISCIPLINE_SIGNALS
 *
 * Tied to AECOBuildingComponents.mjs:
 *   - componentGroupKeys → keys of COMPONENT_GROUPS (parts / recognition buckets)
 *   - elementalMajorGroupIds → ids from ELEMENTAL_MAJOR_GROUPS (elemental taxonomy)
 */

import {
  COMPONENT_GROUP_KEYS,
  ELEMENTAL_MAJOR_GROUP_IDS
} from './AECOBuildingComponents.mjs';

/** @typedef {'spec'|'drawing'|'code'|'report'|'brief'|'contract'|'schedule'|'permit'|'manual'|'form'|'cost'|'procurement'|'heritage'|'zoning'|'environmental'|'commissioning'|'closeout'} DocClassKey */

/** @typedef {'ARCH'|'MEP'|'structural'|'civil'|'landscape'|'electrical'|'plumbing'|'fire'|'BIM'|'SUSTAINABILITY'|'FACILITY'|'CONSTRUCTION'|'ESTIMATING'|'OWNERSHIP'|'PROCUREMENT'|'PREFAB'|'ZONING'|'ENVIRONMENTAL'|'HERITAGE'|'UTILITIES'|'GEOTECHNICAL'|'TRAFFIC'|'PORTFOLIO'|'LEASING'|'BUILDING_SYSTEMS'|'SAFETY'} DisciplineKey */

/**
 * @typedef {'design_consultant'|'engineering_consultant'|'specialty_consultant'|'stakeholder'|'regulatory'|'preconstruction'|'gc_field'|'structural_site_trade'|'envelope_trade'|'interior_trade'|'mep_trade'|'mep_subtrade'|'fire_protection_trade'|'conveyance_specialty'|'site_civil_trade'|'demolition_abatement'|'operations'} HatGroup
 */

/**
 * @typedef {object} Hat
 * @property {string} id Stable id (slug).
 * @property {string} label Display name.
 * @property {HatGroup} hatGroup Consultant vs trade cluster for filtering UI (no external codes).
 * @property {string} [description] When to use this hat.
 * @property {DocClassKey[]} docClassFocus
 * @property {DisciplineKey[]} disciplineFocus
 * @property {string[]} keywords Jargon / synonyms for routing and search.
 * @property {string[]} componentGroupKeys Which AECOBuildingComponents buckets apply for recognition / dimensions.
 * @property {string[]} elementalMajorGroupIds Which elemental major groups (E1557-style tree) apply.
 */

/** Dedupe helper */
function u(...arrays) {
  return [...new Set(arrays.flat().filter(Boolean))];
}

const ALL_COMPONENT_GROUPS = COMPONENT_GROUP_KEYS;
const ALL_ELEMENTAL_MAJORS = ELEMENTAL_MAJOR_GROUP_IDS;

/** Default component + elemental coverage by hat group (overridden per-hat where needed). */
const DEFAULT_COMPONENT_FOCUS_BY_HAT_GROUP = {
  design_consultant: {
    componentGroupKeys: u([
      'exterior_wall',
      'glazing',
      'weather_resistive',
      'roofing',
      'interior_rough',
      'interior_finishes',
      'interior_openings',
      'interior_specialties',
      'millwork',
      'building_references',
      'recognition_bim_hosting',
      'recognition_materials_products',
      'recognition_architectural_misc'
    ]),
    elementalMajorGroupIds: ['shell', 'interiors', 'equipment_and_furnishings', 'services']
  },
  engineering_consultant: {
    componentGroupKeys: u([
      'foundations',
      'below_grade_envelope',
      'slab_on_grade',
      'structural_concrete',
      'precast_prestressed',
      'structural_steel',
      'wood_light_frame',
      'mass_timber',
      'masonry',
      'earthwork',
      'shoring_retention',
      'roofing',
      'exterior_wall',
      'site_utilities',
      'site_paving',
      'recognition_structural_misc',
      'recognition_site_civil_misc',
      'building_references',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['substructure', 'shell', 'building_related_sitework']
  },
  specialty_consultant: {
    componentGroupKeys: u([
      'exterior_wall',
      'glazing',
      'weather_resistive',
      'interior_rough',
      'interior_finishes',
      'mechanical_equipment',
      'ductwork_airside',
      'electrical_lighting',
      'low_voltage',
      'life_safety',
      'controls_bms',
      'recognition_bim_hosting',
      'recognition_materials_products',
      'recognition_mep_systems',
      'recognition_architectural_misc',
      'recognition_specialty_facility'
    ]),
    elementalMajorGroupIds: ['shell', 'interiors', 'services', 'equipment_and_furnishings', 'special_construction_and_demolition']
  },
  stakeholder: {
    componentGroupKeys: ALL_COMPONENT_GROUPS,
    elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
  },
  regulatory: {
    componentGroupKeys: ALL_COMPONENT_GROUPS,
    elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
  },
  preconstruction: {
    componentGroupKeys: ALL_COMPONENT_GROUPS,
    elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
  },
  gc_field: {
    componentGroupKeys: ALL_COMPONENT_GROUPS,
    elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
  },
  structural_site_trade: {
    componentGroupKeys: u([
      'foundations',
      'below_grade_envelope',
      'slab_on_grade',
      'structural_concrete',
      'precast_prestressed',
      'structural_steel',
      'wood_light_frame',
      'mass_timber',
      'masonry',
      'earthwork',
      'shoring_retention',
      'fasteners',
      'waterproofing_below_grade',
      'building_references',
      'recognition_structural_misc',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['substructure', 'shell']
  },
  envelope_trade: {
    componentGroupKeys: u([
      'roofing',
      'exterior_wall',
      'glazing',
      'weather_resistive',
      'structural_steel',
      'fasteners',
      'fire_sprinkler',
      'life_safety',
      'recognition_architectural_misc',
      'recognition_materials_products',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['shell']
  },
  interior_trade: {
    componentGroupKeys: u([
      'interior_rough',
      'interior_finishes',
      'interior_openings',
      'interior_specialties',
      'millwork',
      'building_references',
      'structural_steel',
      'wood_light_frame',
      'recognition_architectural_misc',
      'recognition_materials_products',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['interiors', 'equipment_and_furnishings', 'shell']
  },
  mep_trade: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'mechanical_piping',
      'plumbing_fixtures',
      'plumbing_piping',
      'plumbing_specialty',
      'electrical_distribution',
      'electrical_branch',
      'electrical_lighting',
      'low_voltage',
      'controls_bms',
      'building_references',
      'recognition_mep_systems',
      'recognition_plumbing_drainage',
      'recognition_electrical_low_voltage',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['services']
  },
  mep_subtrade: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'mechanical_piping',
      'plumbing_fixtures',
      'plumbing_piping',
      'plumbing_specialty',
      'electrical_distribution',
      'electrical_branch',
      'electrical_lighting',
      'low_voltage',
      'controls_bms',
      'life_safety',
      'fire_sprinkler',
      'recognition_mep_systems',
      'recognition_plumbing_drainage',
      'recognition_electrical_low_voltage',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['services']
  },
  fire_protection_trade: {
    componentGroupKeys: u([
      'fire_sprinkler',
      'fire_special',
      'life_safety',
      'plumbing_piping',
      'mechanical_piping',
      'building_references',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['services']
  },
  conveyance_specialty: {
    componentGroupKeys: u([
      'conveying',
      'electrical_distribution',
      'electrical_branch',
      'low_voltage',
      'life_safety',
      'building_references',
      'recognition_electrical_low_voltage',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['services']
  },
  site_civil_trade: {
    componentGroupKeys: u([
      'earthwork',
      'shoring_retention',
      'site_utilities',
      'site_electrical',
      'site_paving',
      'landscape',
      'fasteners',
      'building_references',
      'recognition_site_civil_misc',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['building_related_sitework']
  },
  demolition_abatement: {
    componentGroupKeys: u([
      'temp_demolition',
      'structural_concrete',
      'structural_steel',
      'wood_light_frame',
      'life_safety',
      'building_references',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['special_construction_and_demolition', 'shell', 'interiors']
  },
  operations: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'electrical_distribution',
      'electrical_branch',
      'electrical_lighting',
      'low_voltage',
      'controls_bms',
      'plumbing_piping',
      'conveying',
      'equipment_furnishings',
      'life_safety',
      'building_references',
      'recognition_mep_systems',
      'recognition_electrical_low_voltage',
      'extended_parts_and_methods'
    ]),
    elementalMajorGroupIds: ['services', 'equipment_and_furnishings', 'shell', 'interiors']
  }
};

/**
 * Per-hat overrides (consultants & niche trades). Falls back to DEFAULT_COMPONENT_FOCUS_BY_HAT_GROUP[hatGroup].
 * @type {Record<string, { componentGroupKeys: string[], elementalMajorGroupIds: string[] }>}
 */
const HAT_COMPONENT_FOCUS_OVERRIDES = {
  interior_designer: {
    componentGroupKeys: u([
      'interior_rough',
      'interior_finishes',
      'interior_openings',
      'interior_specialties',
      'millwork',
      'equipment_furnishings',
      'building_references',
      'recognition_bim_hosting',
      'recognition_materials_products',
      'recognition_architectural_misc'
    ]),
    elementalMajorGroupIds: ['interiors', 'equipment_and_furnishings']
  },
  landscape_architect: {
    componentGroupKeys: u([
      'landscape',
      'site_paving',
      'earthwork',
      'site_utilities',
      'building_references',
      'recognition_site_civil_misc',
      'recognition_materials_products'
    ]),
    elementalMajorGroupIds: ['building_related_sitework', 'shell']
  },
  lighting_designer: {
    componentGroupKeys: u([
      'electrical_lighting',
      'electrical_branch',
      'controls_bms',
      'interior_finishes',
      'interior_rough',
      'recognition_electrical_low_voltage',
      'recognition_bim_hosting'
    ]),
    elementalMajorGroupIds: ['services', 'interiors', 'shell']
  },
  acoustical_consultant: {
    componentGroupKeys: u([
      'interior_finishes',
      'interior_rough',
      'ductwork_airside',
      'mechanical_equipment',
      'interior_openings',
      'recognition_architectural_misc',
      'recognition_mep_systems',
      'recognition_materials_products'
    ]),
    elementalMajorGroupIds: ['interiors', 'services', 'shell']
  },
  building_envelope_consultant: {
    componentGroupKeys: u([
      'exterior_wall',
      'glazing',
      'weather_resistive',
      'roofing',
      'structural_steel',
      'recognition_architectural_misc',
      'recognition_materials_products',
      'building_references'
    ]),
    elementalMajorGroupIds: ['shell']
  },
  sustainability_consultant: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'electrical_lighting',
      'exterior_wall',
      'weather_resistive',
      'controls_bms',
      'recognition_mep_systems',
      'recognition_materials_products',
      'building_references'
    ]),
    elementalMajorGroupIds: ['shell', 'services', 'interiors', 'building_related_sitework']
  },
  kitchen_design_consultant: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'plumbing_fixtures',
      'plumbing_piping',
      'equipment_furnishings',
      'interior_finishes',
      'life_safety',
      'recognition_specialty_facility',
      'recognition_mep_systems'
    ]),
    elementalMajorGroupIds: ['services', 'equipment_and_furnishings', 'interiors', 'shell']
  },
  security_design_consultant: {
    componentGroupKeys: u([
      'low_voltage',
      'electrical_branch',
      'interior_openings',
      'life_safety',
      'recognition_electrical_low_voltage',
      'recognition_bim_hosting'
    ]),
    elementalMajorGroupIds: ['services', 'interiors', 'shell']
  },
  av_telecom_designer: {
    componentGroupKeys: u([
      'low_voltage',
      'electrical_branch',
      'ductwork_airside',
      'recognition_electrical_low_voltage',
      'recognition_bim_hosting'
    ]),
    elementalMajorGroupIds: ['services', 'interiors']
  },
  wayfinding_signage_designer: {
    componentGroupKeys: u([
      'interior_specialties',
      'life_safety',
      'exterior_wall',
      'site_paving',
      'recognition_architectural_misc',
      'building_references'
    ]),
    elementalMajorGroupIds: ['interiors', 'shell', 'building_related_sitework']
  },
  civil_engineer: {
    componentGroupKeys: u([
      'earthwork',
      'shoring_retention',
      'site_utilities',
      'site_electrical',
      'site_paving',
      'landscape',
      'foundations',
      'recognition_site_civil_misc',
      'building_references'
    ]),
    elementalMajorGroupIds: ['building_related_sitework', 'substructure']
  },
  geotechnical_engineer: {
    componentGroupKeys: u([
      'foundations',
      'below_grade_envelope',
      'slab_on_grade',
      'earthwork',
      'shoring_retention',
      'recognition_structural_misc',
      'building_references'
    ]),
    elementalMajorGroupIds: ['substructure', 'building_related_sitework']
  },
  survey_engineer: {
    componentGroupKeys: u([
      'building_references',
      'site_paving',
      'earthwork',
      'recognition_site_civil_misc'
    ]),
    elementalMajorGroupIds: ['building_related_sitework', 'shell']
  },
  traffic_engineer: {
    componentGroupKeys: u([
      'site_paving',
      'earthwork',
      'landscape',
      'recognition_site_civil_misc',
      'building_references'
    ]),
    elementalMajorGroupIds: ['building_related_sitework']
  },
  mechanical_engineer: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'mechanical_piping',
      'controls_bms',
      'plumbing_fixtures',
      'recognition_mep_systems',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services']
  },
  electrical_engineer: {
    componentGroupKeys: u([
      'electrical_distribution',
      'electrical_branch',
      'electrical_lighting',
      'low_voltage',
      'controls_bms',
      'recognition_electrical_low_voltage',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services']
  },
  plumbing_engineer: {
    componentGroupKeys: u([
      'plumbing_fixtures',
      'plumbing_piping',
      'plumbing_specialty',
      'mechanical_equipment',
      'recognition_plumbing_drainage',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services']
  },
  fire_protection_engineer: {
    componentGroupKeys: u([
      'fire_sprinkler',
      'fire_special',
      'life_safety',
      'plumbing_piping',
      'mechanical_piping',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services']
  },
  code_consultant: {
    componentGroupKeys: ALL_COMPONENT_GROUPS,
    elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
  },
  vertical_transport_consultant: {
    componentGroupKeys: u([
      'conveying',
      'structural_steel',
      'electrical_branch',
      'low_voltage',
      'life_safety',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services', 'shell']
  },
  commissioning_authority: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'mechanical_piping',
      'controls_bms',
      'electrical_distribution',
      'plumbing_piping',
      'life_safety',
      'recognition_mep_systems',
      'recognition_electrical_low_voltage',
      'building_references'
    ]),
    elementalMajorGroupIds: ['services']
  },
  environmental_consultant: {
    componentGroupKeys: u([
      'earthwork',
      'site_utilities',
      'landscape',
      'temp_demolition',
      'recognition_site_civil_misc',
      'building_references'
    ]),
    elementalMajorGroupIds: ['building_related_sitework', 'special_construction_and_demolition']
  },
  medical_gas_plumbing: {
    componentGroupKeys: u([
      'plumbing_specialty',
      'plumbing_piping',
      'plumbing_fixtures',
      'life_safety',
      'recognition_plumbing_drainage',
      'recognition_specialty_facility'
    ]),
    elementalMajorGroupIds: ['services']
  },
  fire_alarm_contractor: {
    componentGroupKeys: u([
      'low_voltage',
      'life_safety',
      'electrical_branch',
      'electrical_lighting',
      'recognition_electrical_low_voltage'
    ]),
    elementalMajorGroupIds: ['services']
  },
  ev_charging_installer: {
    componentGroupKeys: u([
      'electrical_distribution',
      'electrical_branch',
      'site_electrical',
      'recognition_electrical_low_voltage'
    ]),
    elementalMajorGroupIds: ['services', 'building_related_sitework']
  },
  tab_contractor: {
    componentGroupKeys: u([
      'mechanical_equipment',
      'ductwork_airside',
      'mechanical_piping',
      'controls_bms',
      'recognition_mep_systems'
    ]),
    elementalMajorGroupIds: ['services']
  },
  controls_bms: {
    componentGroupKeys: u([
      'controls_bms',
      'mechanical_equipment',
      'electrical_branch',
      'low_voltage',
      'recognition_mep_systems',
      'recognition_electrical_low_voltage'
    ]),
    elementalMajorGroupIds: ['services']
  },
  abatement_hazmat: {
    componentGroupKeys: u([
      'temp_demolition',
      'structural_concrete',
      'structural_steel',
      'wood_light_frame',
      'life_safety',
      'interior_rough',
      'building_references',
      'recognition_specialty_facility'
    ]),
    elementalMajorGroupIds: ['special_construction_and_demolition', 'interiors', 'shell']
  }
};

/**
 * @param {Pick<Hat, 'id' | 'hatGroup'>} hat
 * @returns {{ componentGroupKeys: string[], elementalMajorGroupIds: string[] }}
 */
export function resolveHatComponentFocus(hat) {
  const o = HAT_COMPONENT_FOCUS_OVERRIDES[hat.id];
  if (o) {
    return {
      componentGroupKeys: [...o.componentGroupKeys],
      elementalMajorGroupIds: [...o.elementalMajorGroupIds]
    };
  }
  const d = DEFAULT_COMPONENT_FOCUS_BY_HAT_GROUP[hat.hatGroup];
  if (!d) {
    return {
      componentGroupKeys: ALL_COMPONENT_GROUPS,
      elementalMajorGroupIds: ALL_ELEMENTAL_MAJORS
    };
  }
  return {
    componentGroupKeys: [...d.componentGroupKeys],
    elementalMajorGroupIds: [...d.elementalMajorGroupIds]
  };
}

const HAT_DEFINITIONS = [
  // --- Design consultants ---
  {
    id: 'architect',
    label: 'Architect',
    hatGroup: 'design_consultant',
    description: 'Design intent, assemblies, code-driven layout, coordination.',
    docClassFocus: ['drawing', 'brief', 'spec', 'permit'],
    disciplineFocus: ['ARCH', 'BIM'],
    keywords: ['architect', 'RA', 'design', 'CD', 'DD', 'SD', 'facade', 'program']
  },
  {
    id: 'interior_designer',
    label: 'Interior designer',
    hatGroup: 'design_consultant',
    description: 'Finishes, fixtures, interior partitions, FF&E coordination.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH'],
    keywords: ['interior', 'finishes', 'FF&E', 'materials', 'ID']
  },
  {
    id: 'landscape_architect',
    label: 'Landscape architect',
    hatGroup: 'design_consultant',
    description: 'Site planting, hardscape, grading interface, irrigation design intent.',
    docClassFocus: ['drawing', 'spec', 'permit'],
    disciplineFocus: ['landscape', 'civil'],
    keywords: ['landscape', 'planting', 'hardscape', 'irrigation design']
  },
  {
    id: 'lighting_designer',
    label: 'Lighting designer',
    hatGroup: 'design_consultant',
    description: 'Fixture intent, controls narrative, ceiling coordination.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'electrical'],
    keywords: ['lighting', 'fixture', 'controls', 'illumination']
  },
  {
    id: 'acoustical_consultant',
    label: 'Acoustical consultant',
    hatGroup: 'specialty_consultant',
    description: 'Noise, STC, room acoustics, isolation details.',
    docClassFocus: ['spec', 'drawing', 'report'],
    disciplineFocus: ['ARCH', 'MEP'],
    keywords: ['acoustics', 'STC', 'NIC', 'sound', 'isolation']
  },
  {
    id: 'building_envelope_consultant',
    label: 'Building envelope consultant',
    hatGroup: 'specialty_consultant',
    description: 'WRB, air barrier, thermal, condensation, cladding transitions.',
    docClassFocus: ['spec', 'drawing', 'report'],
    disciplineFocus: ['ARCH', 'SUSTAINABILITY'],
    keywords: ['envelope', 'facade', 'WRB', 'air barrier', 'thermal', 'condensation']
  },
  {
    id: 'sustainability_consultant',
    label: 'Sustainability / LEED consultant',
    hatGroup: 'specialty_consultant',
    description: 'Energy, credits, metering, envelope and systems alignment.',
    docClassFocus: ['spec', 'report', 'environmental'],
    disciplineFocus: ['SUSTAINABILITY', 'ENVIRONMENTAL'],
    keywords: ['LEED', 'WELL', 'energy', 'carbon', 'green']
  },
  {
    id: 'specifications_writer',
    label: 'Specifications / specifier',
    hatGroup: 'design_consultant',
    description: 'Spec sections, substitutions, product compliance.',
    docClassFocus: ['spec', 'procurement'],
    disciplineFocus: ['ARCH', 'PROCUREMENT'],
    keywords: ['spec', 'CSI', 'MasterFormat', 'substitution', 'section']
  },
  {
    id: 'kitchen_design_consultant',
    label: 'Food service / kitchen consultant',
    hatGroup: 'specialty_consultant',
    description: 'Kitchen equipment, hoods, MEP rough-in coordination.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['MEP', 'ARCH'],
    keywords: ['kitchen', 'FSE', 'hood', 'exhaust', 'stainless']
  },
  {
    id: 'security_design_consultant',
    label: 'Security design consultant',
    hatGroup: 'specialty_consultant',
    description: 'Access control, cameras, intrusion, door hardware integration.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'BUILDING_SYSTEMS'],
    keywords: ['security', 'access control', 'CCTV', 'intrusion']
  },
  {
    id: 'av_telecom_designer',
    label: 'Audiovisual / telecom designer',
    hatGroup: 'specialty_consultant',
    description: 'AV racks, head-end, cable pathways, room technology.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'BUILDING_SYSTEMS'],
    keywords: ['AV', 'telecom', 'data', 'structured cable', 'head end']
  },
  {
    id: 'wayfinding_signage_designer',
    label: 'Wayfinding / signage designer',
    hatGroup: 'design_consultant',
    description: 'Sign types, mounting, visibility, code-required signage.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'fire'],
    keywords: ['signage', 'wayfinding', 'egress sign', 'ADA sign']
  },

  // --- Engineering consultants ---
  {
    id: 'structural_engineer',
    label: 'Structural engineer',
    hatGroup: 'engineering_consultant',
    description: 'Members, loads, foundations, lateral system, connections.',
    docClassFocus: ['drawing', 'spec', 'code', 'report'],
    disciplineFocus: ['structural', 'GEOTECHNICAL'],
    keywords: ['structural', 'PE', 'loads', 'seismic', 'wind', 'foundation']
  },
  {
    id: 'civil_engineer',
    label: 'Civil engineer',
    hatGroup: 'engineering_consultant',
    description: 'Grading, drainage, utilities, paving, erosion control.',
    docClassFocus: ['drawing', 'permit', 'environmental', 'report'],
    disciplineFocus: ['civil', 'TRAFFIC'],
    keywords: ['civil', 'site', 'grading', 'stormwater', 'utility']
  },
  {
    id: 'geotechnical_engineer',
    label: 'Geotechnical engineer',
    hatGroup: 'engineering_consultant',
    description: 'Soils, bearing, settlement, groundwater, excavation support design.',
    docClassFocus: ['report', 'drawing', 'spec'],
    disciplineFocus: ['GEOTECHNICAL', 'civil'],
    keywords: ['geotech', 'soils', 'bearing', 'settlement', 'shoring design']
  },
  {
    id: 'survey_engineer',
    label: 'Surveyor / geomatics',
    hatGroup: 'engineering_consultant',
    description: 'Benchmarks, control, as-builts, layout basis.',
    docClassFocus: ['drawing', 'report'],
    disciplineFocus: ['civil', 'CONSTRUCTION'],
    keywords: ['survey', 'benchmark', 'control', 'topo', 'layout']
  },
  {
    id: 'traffic_engineer',
    label: 'Traffic engineer',
    hatGroup: 'engineering_consultant',
    description: 'Access, circulation, parking counts, loading.',
    docClassFocus: ['drawing', 'permit', 'report'],
    disciplineFocus: ['TRAFFIC', 'civil'],
    keywords: ['traffic', 'parking', 'loading zone', 'curb cut']
  },
  {
    id: 'mechanical_engineer',
    label: 'Mechanical engineer (design)',
    hatGroup: 'engineering_consultant',
    description: 'HVAC loads, equipment selection, duct/pipe sizing, energy.',
    docClassFocus: ['drawing', 'spec', 'commissioning'],
    disciplineFocus: ['MEP', 'BUILDING_SYSTEMS'],
    keywords: ['mechanical engineer', 'HVAC design', 'loads', 'equipment']
  },
  {
    id: 'electrical_engineer',
    label: 'Electrical engineer (design)',
    hatGroup: 'engineering_consultant',
    description: 'Service, distribution, fault current, lighting design, load.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['electrical', 'UTILITIES'],
    keywords: ['electrical engineer', 'one-line', 'short circuit', 'load']
  },
  {
    id: 'plumbing_engineer',
    label: 'Plumbing engineer (design)',
    hatGroup: 'engineering_consultant',
    description: 'Fixture units, pipe sizing, venting, specialty systems.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['plumbing', 'UTILITIES'],
    keywords: ['plumbing engineer', 'sanitary', 'vent', 'domestic']
  },
  {
    id: 'fire_protection_engineer',
    label: 'Fire protection engineer (design)',
    hatGroup: 'engineering_consultant',
    description: 'Sprinkler density, standpipe, special suppression.',
    docClassFocus: ['drawing', 'spec', 'code', 'report'],
    disciplineFocus: ['fire'],
    keywords: ['FP engineer', 'sprinkler design', 'NFPA', 'density']
  },
  {
    id: 'code_consultant',
    label: 'Code consultant',
    hatGroup: 'specialty_consultant',
    description: 'Occupancy, height/area, egress, accessibility overlays.',
    docClassFocus: ['code', 'report', 'drawing'],
    disciplineFocus: ['ZONING', 'fire', 'SAFETY', 'ARCH'],
    keywords: ['code', 'egress', 'accessibility', 'occupancy']
  },
  {
    id: 'vertical_transport_consultant',
    label: 'Vertical transportation consultant',
    hatGroup: 'specialty_consultant',
    description: 'Elevator/escalator performance, pits, machine rooms.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['BUILDING_SYSTEMS', 'ARCH'],
    keywords: ['elevator consultant', 'VT', 'lift', 'escalator']
  },
  {
    id: 'commissioning_authority',
    label: 'Commissioning authority (CxA)',
    hatGroup: 'specialty_consultant',
    description: 'Systems verification, OPR/BOD alignment, functional tests.',
    docClassFocus: ['commissioning', 'spec', 'report'],
    disciplineFocus: ['BUILDING_SYSTEMS', 'MEP'],
    keywords: ['CxA', 'commissioning', 'functional test', 'OPR']
  },
  {
    id: 'environmental_consultant',
    label: 'Environmental consultant',
    hatGroup: 'specialty_consultant',
    description: 'Phase I/II, remediation, erosion, permitting support.',
    docClassFocus: ['environmental', 'report', 'permit'],
    disciplineFocus: ['ENVIRONMENTAL', 'civil'],
    keywords: ['environmental', 'contamination', 'remediation', 'SWPPP']
  },

  // --- Stakeholders ---
  {
    id: 'owner_representative',
    label: 'Owner / client representative',
    hatGroup: 'stakeholder',
    description: 'Scope, budget, milestones, acceptance.',
    docClassFocus: ['brief', 'contract', 'schedule', 'report'],
    disciplineFocus: ['OWNERSHIP'],
    keywords: ['owner', 'client', 'OPR', 'acceptance']
  },
  {
    id: 'owners_project_manager',
    label: "Owner's project manager",
    hatGroup: 'stakeholder',
    description: 'Stakeholder alignment, change review, vendor coordination.',
    docClassFocus: ['contract', 'schedule', 'report'],
    disciplineFocus: ['OWNERSHIP', 'CONSTRUCTION'],
    keywords: ['OPM', 'owner PM', 'stakeholder']
  },
  {
    id: 'lender_inspector',
    label: 'Lender / third-party reviewer',
    hatGroup: 'stakeholder',
    description: 'Progress, quality, draw support.',
    docClassFocus: ['report', 'schedule'],
    disciplineFocus: ['OWNERSHIP'],
    keywords: ['lender', 'inspector', 'draw', 'TPR']
  },
  {
    id: 'leasing_property',
    label: 'Leasing / property management',
    hatGroup: 'stakeholder',
    description: 'Suites, amenities, turnover criteria.',
    docClassFocus: ['brief', 'drawing', 'contract'],
    disciplineFocus: ['LEASING', 'PORTFOLIO'],
    keywords: ['leasing', 'tenant', 'suite', 'property manager']
  },

  // --- Regulatory / review ---
  {
    id: 'ahj_plan_reviewer',
    label: 'Authority having jurisdiction (plan review)',
    hatGroup: 'regulatory',
    description: 'Code compliance, completeness, permit conditions.',
    docClassFocus: ['permit', 'code', 'drawing', 'zoning'],
    disciplineFocus: ['ZONING', 'fire', 'SAFETY', 'ARCH'],
    keywords: ['AHJ', 'plan check', 'building official', 'inspector']
  },
  {
    id: 'heritage_officer',
    label: 'Heritage / preservation reviewer',
    hatGroup: 'regulatory',
    description: 'Conservation, materials, reinstatement.',
    docClassFocus: ['heritage', 'permit', 'drawing'],
    disciplineFocus: ['HERITAGE', 'ARCH'],
    keywords: ['heritage', 'preservation', 'HPO', 'conservation']
  },
  {
    id: 'accessibility_reviewer',
    label: 'Accessibility reviewer',
    hatGroup: 'regulatory',
    description: 'Routes, clearances, hardware, fixtures.',
    docClassFocus: ['code', 'drawing', 'report'],
    disciplineFocus: ['ARCH', 'SAFETY'],
    keywords: ['ADA', 'accessibility', 'AODA', 'barrier-free']
  },

  // --- Preconstruction ---
  {
    id: 'estimator',
    label: 'Estimator',
    hatGroup: 'preconstruction',
    description: 'Quantities, scope, alternates, allowances.',
    docClassFocus: ['drawing', 'spec', 'cost', 'contract'],
    disciplineFocus: ['ESTIMATING', 'PROCUREMENT'],
    keywords: ['estimate', 'takeoff', 'alternate', 'allowance']
  },
  {
    id: 'scheduler',
    label: 'Scheduler / planner',
    hatGroup: 'preconstruction',
    description: 'Logic, milestones, trade flow.',
    docClassFocus: ['schedule', 'contract', 'drawing'],
    disciplineFocus: ['CONSTRUCTION'],
    keywords: ['CPM', 'schedule', 'look-ahead', 'milestone']
  },
  {
    id: 'procurement_contracts',
    label: 'Procurement / contracts',
    hatGroup: 'preconstruction',
    description: 'Bid packages, subs, POs, submittals.',
    docClassFocus: ['procurement', 'contract', 'form', 'spec'],
    disciplineFocus: ['PROCUREMENT'],
    keywords: ['procurement', 'submittal', 'PO', 'bid']
  },
  {
    id: 'preconstruction_manager',
    label: 'Preconstruction manager',
    hatGroup: 'preconstruction',
    description: 'Scope packaging, trade boundaries, risk.',
    docClassFocus: ['drawing', 'contract', 'cost'],
    disciplineFocus: ['CONSTRUCTION', 'ESTIMATING'],
    keywords: ['precon', 'packaging', 'trade flow']
  },

  // --- GC / CM field ---
  {
    id: 'construction_manager',
    label: 'Construction manager / project manager',
    hatGroup: 'gc_field',
    description: 'Overall delivery, RFIs, coordination, cost/time.',
    docClassFocus: ['drawing', 'schedule', 'contract', 'report'],
    disciplineFocus: ['CONSTRUCTION'],
    keywords: ['CM', 'PM', 'project manager', 'delivery']
  },
  {
    id: 'superintendent',
    label: 'Superintendent / general foreman',
    hatGroup: 'gc_field',
    description: 'Daily sequence, trade access, logistics.',
    docClassFocus: ['drawing', 'schedule', 'report'],
    disciplineFocus: ['CONSTRUCTION', 'SAFETY'],
    keywords: ['superintendent', 'foreman', 'field', 'sequence']
  },
  {
    id: 'site_safety',
    label: 'Site safety',
    hatGroup: 'gc_field',
    description: 'Fall protection, access, hot work, logistics hazards.',
    docClassFocus: ['report', 'contract'],
    disciplineFocus: ['SAFETY', 'CONSTRUCTION'],
    keywords: ['safety', 'OSHA', 'JHSC', 'hazard']
  },
  {
    id: 'quality_control',
    label: 'Quality control / QA',
    hatGroup: 'gc_field',
    description: 'ITP, hold points, inspections, deficiencies.',
    docClassFocus: ['report', 'spec', 'drawing'],
    disciplineFocus: ['CONSTRUCTION', 'SAFETY'],
    keywords: ['QC', 'QA', 'inspection', 'ITP', 'NCR']
  },
  {
    id: 'layout_engineer_field',
    label: 'Layout / field engineer',
    hatGroup: 'gc_field',
    description: 'Grid, benchmark, embeds, as-built capture.',
    docClassFocus: ['drawing', 'report'],
    disciplineFocus: ['CONSTRUCTION', 'civil'],
    keywords: ['layout', 'survey field', 'benchmark', 'embed']
  },
  {
    id: 'bim_vdc_coordinator',
    label: 'BIM / VDC coordinator',
    hatGroup: 'gc_field',
    description: 'Clashes, trade models, issue tracking.',
    docClassFocus: ['drawing', 'report'],
    disciplineFocus: ['BIM', 'MEP', 'structural', 'ARCH'],
    keywords: ['BIM', 'VDC', 'clash', 'coordination', 'Navisworks']
  },

  // --- Structural & site trades ---
  {
    id: 'excavation_earthwork',
    label: 'Excavation / earthwork contractor',
    hatGroup: 'structural_site_trade',
    description: 'Cuts, fills, compaction, haul routes.',
    docClassFocus: ['drawing', 'schedule'],
    disciplineFocus: ['civil', 'CONSTRUCTION'],
    keywords: ['excavation', 'earthwork', 'cut', 'fill', 'compaction']
  },
  {
    id: 'shoring_underpinning',
    label: 'Shoring / underpinning contractor',
    hatGroup: 'structural_site_trade',
    description: 'Soldier pile, lagging, rakers, dewatering interface.',
    docClassFocus: ['drawing', 'spec', 'report'],
    disciplineFocus: ['structural', 'GEOTECHNICAL', 'CONSTRUCTION'],
    keywords: ['shoring', 'underpinning', 'lagging', 'tieback']
  },
  {
    id: 'piling_deep_foundations',
    label: 'Piling / deep foundations contractor',
    hatGroup: 'structural_site_trade',
    description: 'Piles, caissons, drilling, tolerances.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'GEOTECHNICAL'],
    keywords: ['pile', 'caisson', 'drilled', 'micropile']
  },
  {
    id: 'formwork_contractor',
    label: 'Formwork contractor',
    hatGroup: 'structural_site_trade',
    description: 'Forming, pour sequence, anchor bolts, embeds.',
    docClassFocus: ['drawing', 'schedule'],
    disciplineFocus: ['structural', 'CONSTRUCTION'],
    keywords: ['formwork', 'form', 'pour', 'anchor bolt', 'embed']
  },
  {
    id: 'rebar_contractor',
    label: 'Reinforcing steel contractor',
    hatGroup: 'structural_site_trade',
    description: 'Rebar laps, chairs, couplers, cover.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'CONSTRUCTION'],
    keywords: ['rebar', 'reinforcing', 'lap', 'coupler', 'cover']
  },
  {
    id: 'concrete_placement',
    label: 'Concrete placement / finisher',
    hatGroup: 'structural_site_trade',
    description: 'Slabs, walls, joints, flatness, curing.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'CONSTRUCTION'],
    keywords: ['concrete', 'placement', 'flatwork', 'FF/FL', 'joint']
  },
  {
    id: 'structural_steel_fabricator',
    label: 'Structural steel fabricator',
    hatGroup: 'structural_site_trade',
    description: 'Shop drawings, cuts, welds, shipping marks.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'PREFAB'],
    keywords: ['steel fab', 'shop drawing', 'weld', 'bolt']
  },
  {
    id: 'structural_steel_erector',
    label: 'Structural steel erector',
    hatGroup: 'structural_site_trade',
    description: 'Pick plans, connections, bolt-up, decking.',
    docClassFocus: ['drawing', 'schedule'],
    disciplineFocus: ['structural', 'CONSTRUCTION'],
    keywords: ['steel erection', 'ironworker', 'deck', 'connection']
  },
  {
    id: 'precast_erector',
    label: 'Precast erector',
    hatGroup: 'structural_site_trade',
    description: 'Panel bracing, connections, grouting.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'PREFAB'],
    keywords: ['precast', 'panel', 'erection', 'brace']
  },
  {
    id: 'mass_timber',
    label: 'Mass timber / wood systems contractor',
    hatGroup: 'structural_site_trade',
    description: 'CLT, glulam, connectors, tolerances.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'PREFAB'],
    keywords: ['CLT', 'glulam', 'timber', 'wood']
  },
  {
    id: 'masonry_contractor',
    label: 'Masonry contractor',
    hatGroup: 'structural_site_trade',
    description: 'CMU, brick, stone, anchors, movement joints.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['structural', 'ARCH'],
    keywords: ['masonry', 'CMU', 'brick', 'stone', 'anchor']
  },
  {
    id: 'waterproofing_below_grade',
    label: 'Below-grade waterproofing contractor',
    hatGroup: 'structural_site_trade',
    description: 'Membranes, drainage board, protection course.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'structural'],
    keywords: ['waterproofing', 'below grade', 'membrane', 'drainage board']
  },

  // --- Envelope & exterior ---
  {
    id: 'roofing_contractor',
    label: 'Roofing contractor',
    hatGroup: 'envelope_trade',
    description: 'Insulation, membrane, flashings, penetrations.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['roofing', 'membrane', 'flashing', 'penetration']
  },
  {
    id: 'sheet_metal',
    label: 'Architectural sheet metal',
    hatGroup: 'envelope_trade',
    description: 'Copings, gutters, metal flashings, trim.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['sheet metal', 'coping', 'gutter', 'metal trim']
  },
  {
    id: 'cladding_contractor',
    label: 'Cladding / rainscreen contractor',
    hatGroup: 'envelope_trade',
    description: 'Panels, clips, cavity, fire blocking at perimeter.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['cladding', 'rainscreen', 'panel', 'clip']
  },
  {
    id: 'glazing_curtainwall',
    label: 'Glazing / curtain wall contractor',
    hatGroup: 'envelope_trade',
    description: 'Anchors, mullions, glass, sealants, deflection.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'structural'],
    keywords: ['glazing', 'curtain wall', 'window wall', 'mullion']
  },
  {
    id: 'windows_doors_exterior',
    label: 'Exterior windows & doors installer',
    hatGroup: 'envelope_trade',
    description: 'Rough openings, subsills, integration with WRB.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['window install', 'storefront', 'exterior door', 'rough opening']
  },
  {
    id: 'air_barrier_insulation',
    label: 'Air barrier & insulation contractor',
    hatGroup: 'envelope_trade',
    description: 'Continuous air barrier, cavity insulation, continuity.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'SUSTAINABILITY'],
    keywords: ['air barrier', 'insulation', 'continuous', 'cavity']
  },
  {
    id: 'firestopping_contractor',
    label: 'Firestopping / smoke seal contractor',
    hatGroup: 'envelope_trade',
    description: 'Penetrations, joints, perimeter fire containment.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['fire', 'CONSTRUCTION'],
    keywords: ['firestop', 'through penetration', 'smoke seal', 'UL']
  },

  // --- Interior ---
  {
    id: 'rough_carpentry_framing',
    label: 'Rough carpentry / framing',
    hatGroup: 'interior_trade',
    description: 'Studs, blocking, backing, openings.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION', 'PREFAB'],
    keywords: ['framing', 'stud', 'blocking', 'backing']
  },
  {
    id: 'drywall_ceiling',
    label: 'Drywall / acoustical ceilings',
    hatGroup: 'interior_trade',
    description: 'Board, finishes, ceiling grid, penetrations.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['drywall', 'gypsum', 'ACT', 'ceiling tile']
  },
  {
    id: 'flooring_contractor',
    label: 'Flooring contractor',
    hatGroup: 'interior_trade',
    description: 'Substrate, moisture, transitions, finishes.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['flooring', 'tile', 'carpet', 'epoxy', 'VCT']
  },
  {
    id: 'millwork_casework',
    label: 'Millwork / casework installer',
    hatGroup: 'interior_trade',
    description: 'Shop-built units, alignment, integration with MEP.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['millwork', 'casework', 'joinery', 'counter']
  },
  {
    id: 'painting_wallcovering',
    label: 'Painting & wallcovering',
    hatGroup: 'interior_trade',
    description: 'Substrate prep, finishes, VOC compliance.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['paint', 'wallcovering', 'primer', 'coating']
  },
  {
    id: 'toilet_accessories_specialties',
    label: 'Toilet partitions & specialties',
    hatGroup: 'interior_trade',
    description: 'Partitions, accessories, lockers, cubicles.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['ARCH', 'CONSTRUCTION'],
    keywords: ['toilet partition', 'accessories', 'locker', 'cubicle']
  },
  {
    id: 'prefab_wall_panel_shop',
    label: 'Prefab wall / panel shop',
    hatGroup: 'interior_trade',
    description: 'Panel fabrication, QA, labels, shipping.',
    docClassFocus: ['drawing', 'spec', 'schedule'],
    disciplineFocus: ['PREFAB', 'ARCH', 'structural'],
    keywords: ['prefab', 'panel shop', 'modular', 'QC']
  },

  // --- MEP trades ---
  {
    id: 'plumbing_mechanical_contractor',
    label: 'Plumbing contractor (rough & trim)',
    hatGroup: 'mep_trade',
    description: 'Rough-in, fixtures, equipment connections.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['plumbing', 'UTILITIES'],
    keywords: ['plumber', 'rough-in', 'fixture', 'domestic', 'waste']
  },
  {
    id: 'medical_gas_plumbing',
    label: 'Medical gas / specialty plumbing',
    hatGroup: 'mep_subtrade',
    description: 'Med gas, lab waste, interceptors.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['plumbing', 'BUILDING_SYSTEMS'],
    keywords: ['med gas', 'nitrogen', 'vacuum', 'acid waste']
  },
  {
    id: 'hvac_mechanical_contractor',
    label: 'HVAC / mechanical contractor',
    hatGroup: 'mep_trade',
    description: 'Equipment, duct, pipe, hangers.',
    docClassFocus: ['drawing', 'spec', 'commissioning'],
    disciplineFocus: ['MEP', 'BUILDING_SYSTEMS'],
    keywords: ['HVAC', 'duct', 'pipe', 'equipment']
  },
  {
    id: 'sheet_metal_hvac',
    label: 'Sheet metal (duct fabrication & install)',
    hatGroup: 'mep_subtrade',
    description: 'Duct routing, connections, access.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['MEP', 'CONSTRUCTION'],
    keywords: ['sheet metal', 'ductwork', 'SMACNA']
  },
  {
    id: 'piping_mechanical',
    label: 'Mechanical piping contractor',
    hatGroup: 'mep_subtrade',
    description: 'Hydronic, refrigerant, condenser water.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['MEP', 'CONSTRUCTION'],
    keywords: ['hydronic', 'refrigerant', 'pipe', 'valve']
  },
  {
    id: 'controls_bms',
    label: 'Controls / building automation contractor',
    hatGroup: 'mep_subtrade',
    description: 'BMS, BACnet, points, integration.',
    docClassFocus: ['drawing', 'spec', 'commissioning'],
    disciplineFocus: ['BUILDING_SYSTEMS', 'electrical'],
    keywords: ['BMS', 'controls', 'BACnet', 'points']
  },
  {
    id: 'tab_contractor',
    label: 'Testing, adjusting & balancing (TAB)',
    hatGroup: 'mep_subtrade',
    description: 'Air/water balance, reports, issues.',
    docClassFocus: ['report', 'commissioning', 'spec'],
    disciplineFocus: ['MEP', 'BUILDING_SYSTEMS'],
    keywords: ['TAB', 'balancing', 'airflow', 'hydronic balance']
  },
  {
    id: 'electrical_contractor',
    label: 'Electrical contractor (power & lighting)',
    hatGroup: 'mep_trade',
    description: 'Conduit, cable, panels, devices, fixtures.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'UTILITIES'],
    keywords: ['electrician', 'conduit', 'panel', 'lighting']
  },
  {
    id: 'low_voltage_contractor',
    label: 'Low voltage / structured cable contractor',
    hatGroup: 'mep_subtrade',
    description: 'Data, fiber, pathways, racks.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'BUILDING_SYSTEMS'],
    keywords: ['low voltage', 'data', 'fiber', 'pathway']
  },
  {
    id: 'fire_alarm_contractor',
    label: 'Fire alarm / life safety systems contractor',
    hatGroup: 'mep_subtrade',
    description: 'FA devices, panels, integration.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['fire', 'electrical'],
    keywords: ['fire alarm', 'FACP', 'detector', 'strobe']
  },
  {
    id: 'ev_charging_installer',
    label: 'EV charging / specialty electrical',
    hatGroup: 'mep_subtrade',
    description: 'EVSE, load management, feeders.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'UTILITIES'],
    keywords: ['EV', 'EVSE', 'charging']
  },

  // --- Fire protection trades ---
  {
    id: 'sprinkler_contractor',
    label: 'Fire sprinkler contractor',
    hatGroup: 'fire_protection_trade',
    description: 'Heads, piping, hangers, inspections.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['fire', 'plumbing'],
    keywords: ['sprinkler', 'NFPA 13', 'head', 'branch']
  },
  {
    id: 'standpipe_firehose_contractor',
    label: 'Standpipe / fire hose systems',
    hatGroup: 'fire_protection_trade',
    description: 'Risers, hose valves, cabinets.',
    docClassFocus: ['drawing', 'spec', 'code'],
    disciplineFocus: ['fire', 'plumbing'],
    keywords: ['standpipe', 'hose valve', 'fire hose']
  },
  {
    id: 'special_suppression',
    label: 'Special hazard / clean agent suppression',
    hatGroup: 'fire_protection_trade',
    description: 'Clean agent, foam, CO2 where applicable.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['fire'],
    keywords: ['clean agent', 'FM-200', 'foam', 'special hazard']
  },

  // --- Conveyance ---
  {
    id: 'elevator_contractor',
    label: 'Elevator / lift contractor',
    hatGroup: 'conveyance_specialty',
    description: 'Rails, doors, pits, machine room.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['BUILDING_SYSTEMS', 'CONSTRUCTION'],
    keywords: ['elevator', 'lift', 'hoistway', 'pit']
  },
  {
    id: 'escalator_contractor',
    label: 'Escalator / moving walk contractor',
    hatGroup: 'conveyance_specialty',
    description: 'Truss, supports, clearances.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['BUILDING_SYSTEMS'],
    keywords: ['escalator', 'moving walk']
  },

  // --- Site & civil trades ---
  {
    id: 'utilities_earthwork_site',
    label: 'Site utilities contractor',
    hatGroup: 'site_civil_trade',
    description: 'Water, sewer, storm, trenching, bedding.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['civil', 'UTILITIES'],
    keywords: ['utilities', 'water main', 'sewer', 'storm']
  },
  {
    id: 'paving_asphalt_concrete',
    label: 'Paving contractor (asphalt / concrete)',
    hatGroup: 'site_civil_trade',
    description: 'Subgrade, base, pavement, joints.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['civil', 'CONSTRUCTION'],
    keywords: ['paving', 'asphalt', 'concrete pavement', 'subgrade']
  },
  {
    id: 'landscape_install',
    label: 'Landscape installation contractor',
    hatGroup: 'site_civil_trade',
    description: 'Soil, planting, edging, mulch.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['landscape', 'civil'],
    keywords: ['landscape install', 'planting', 'sod', 'soil']
  },
  {
    id: 'irrigation_contractor',
    label: 'Irrigation contractor',
    hatGroup: 'site_civil_trade',
    description: 'Lines, heads, controllers, backflow.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['landscape', 'plumbing'],
    keywords: ['irrigation', 'sprinkler head', 'controller', 'backflow']
  },
  {
    id: 'site_lighting_electrical',
    label: 'Site electrical / site lighting',
    hatGroup: 'site_civil_trade',
    description: 'Poles, duct banks, site power.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['electrical', 'civil'],
    keywords: ['site lighting', 'pole', 'duct bank', 'photo control']
  },
  {
    id: 'fencing_site_amenities',
    label: 'Fencing / site amenities installer',
    hatGroup: 'site_civil_trade',
    description: 'Fences, gates, bollards, site furniture.',
    docClassFocus: ['drawing', 'spec'],
    disciplineFocus: ['civil', 'ARCH'],
    keywords: ['fence', 'gate', 'bollard', 'site furnishing']
  },

  // --- Demolition & abatement ---
  {
    id: 'demolition_contractor',
    label: 'Demolition contractor',
    hatGroup: 'demolition_abatement',
    description: 'Selective demo, protection, sequencing.',
    docClassFocus: ['drawing', 'schedule'],
    disciplineFocus: ['CONSTRUCTION', 'SAFETY'],
    keywords: ['demolition', 'selective demo', 'protection']
  },
  {
    id: 'abatement_hazmat',
    label: 'Hazmat abatement contractor',
    hatGroup: 'demolition_abatement',
    description: 'Asbestos, lead, containment.',
    docClassFocus: ['spec', 'report', 'environmental'],
    disciplineFocus: ['ENVIRONMENTAL', 'SAFETY'],
    keywords: ['abatement', 'asbestos', 'lead', 'containment']
  },

  // --- Operations ---
  {
    id: 'facility_management',
    label: 'Facility management / O&M',
    hatGroup: 'operations',
    description: 'Handover, assets, maintenance, warranties.',
    docClassFocus: ['manual', 'closeout', 'commissioning'],
    disciplineFocus: ['FACILITY', 'BUILDING_SYSTEMS'],
    keywords: ['O&M', 'CMMS', 'warranty', 'asset']
  },
  {
    id: 'building_operator',
    label: 'Building operator / engineer (owner)',
    hatGroup: 'operations',
    description: 'Run-state, access, troubleshooting.',
    docClassFocus: ['manual', 'report'],
    disciplineFocus: ['FACILITY', 'BUILDING_SYSTEMS'],
    keywords: ['operator', 'building engineer', 'BAS']
  }
];

/** Hats with {@link Hat#componentGroupKeys} and {@link Hat#elementalMajorGroupIds} resolved from components + taxonomy. */
export const HATS = HAT_DEFINITIONS.map((h) => {
  const focus = resolveHatComponentFocus(h);
  return {
    ...h,
    componentGroupKeys: focus.componentGroupKeys,
    elementalMajorGroupIds: focus.elementalMajorGroupIds
  };
});

/** @type {Record<string, Hat>} */
export const HAT_BY_ID = Object.fromEntries(HATS.map((h) => [h.id, h]));

/** Group labels for UI */
export const HAT_GROUP_LABELS = {
  design_consultant: 'Design consultants',
  engineering_consultant: 'Engineering consultants',
  specialty_consultant: 'Specialty consultants',
  stakeholder: 'Owners & stakeholders',
  regulatory: 'Regulatory & review',
  preconstruction: 'Preconstruction',
  gc_field: 'GC / CM field',
  structural_site_trade: 'Structural & site trades',
  envelope_trade: 'Envelope & exterior trades',
  interior_trade: 'Interior trades',
  mep_trade: 'MEP trades',
  mep_subtrade: 'MEP subtrades',
  fire_protection_trade: 'Fire protection trades',
  conveyance_specialty: 'Conveyance',
  site_civil_trade: 'Site & civil trades',
  demolition_abatement: 'Demolition & abatement',
  operations: 'Operations & facility'
};

/** @type {HatGroup[]} */
export const HAT_GROUPS = /** @type {HatGroup[]} */ (Object.keys(HAT_GROUP_LABELS));

/** Hats filtered by group */
export function hatsByGroup(group) {
  return HATS.filter((h) => h.hatGroup === group);
}

/** Doc class keys — keep in sync with AECOClassifier DOC_CLASS_SIGNALS */
export const DOC_CLASS_KEYS = [
  'spec',
  'drawing',
  'code',
  'report',
  'brief',
  'contract',
  'schedule',
  'permit',
  'manual',
  'form',
  'cost',
  'procurement',
  'heritage',
  'zoning',
  'environmental',
  'commissioning',
  'closeout'
];

/** Discipline keys — keep in sync with AECOClassifier DISCIPLINE_SIGNALS */
export const DISCIPLINE_KEYS = [
  'ARCH',
  'MEP',
  'structural',
  'civil',
  'landscape',
  'electrical',
  'plumbing',
  'fire',
  'BIM',
  'SUSTAINABILITY',
  'FACILITY',
  'CONSTRUCTION',
  'ESTIMATING',
  'OWNERSHIP',
  'PROCUREMENT',
  'PREFAB',
  'ZONING',
  'ENVIRONMENTAL',
  'HERITAGE',
  'UTILITIES',
  'GEOTECHNICAL',
  'TRAFFIC',
  'PORTFOLIO',
  'LEASING',
  'BUILDING_SYSTEMS',
  'SAFETY'
];
