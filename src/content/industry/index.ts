export { formatIndustryContextForPrompt, getIndustryHatBurns } from "./hatBurns";
export {
  ARCHITECT_ANGLES,
  ARCHITECT_AVOID,
  ARCHITECT_GRILL_ON,
  ARCHITECT_MEAN_LINES,
  ARCHITECT_ROAST_LINES,
} from "./architectVariety";
export { BIM_ANGLES, BIM_AVOID, BIM_GRILL_ON, BIM_ROAST_LINES } from "./bimVariety";
export { MEP_ANGLES, MEP_AVOID, MEP_GRILL_ON, MEP_ROAST_LINES } from "./mepVariety";
export { PM_ANGLES, PM_AVOID, PM_GRILL_ON, PM_ROAST_LINES } from "./pmVariety";
export {
  STRUCTURAL_ANGLES,
  STRUCTURAL_AVOID,
  STRUCTURAL_GRILL_ON,
  STRUCTURAL_ROAST_LINES,
} from "./structuralVariety";
export {
  SUPERINTENDENT_ANGLES,
  SUPERINTENDENT_AVOID,
  SUPERINTENDENT_GRILL_ON,
  SUPERINTENDENT_ROAST_LINES,
} from "./superintendentVariety";
export {
  CIVIL_ROAST_LINES,
  COMMISSIONING_ROAST_LINES,
  ENVELOPE_ROAST_LINES,
  ESTIMATOR_ROAST_LINES,
  MEP_TRADE_ROAST_LINES,
  REGULATORY_ROAST_LINES,
  SUSTAINABILITY_ROAST_LINES,
} from "./tradeVariety";
export { HAT_ARCHETYPE_GUIDES } from "./hatArchetypeGuides";
export {
  formatHatArchetypeBlock,
  getRoastAnglesForHat,
  hatArchetypeCoverage,
  resolveHatArchetype,
} from "./hatArchetypes";
export { getIndustryHat, matchIndustryHat, type HatMatch } from "./matchHat";
export { rolePoolKeyForHat, rolePoolKeyFromText } from "./rolePoolMap";
export { HATS } from "./loadHats";
