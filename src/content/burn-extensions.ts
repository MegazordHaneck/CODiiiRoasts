import type { Intensity } from "../types";
import { AEC_STEREOTYPE_BURNS } from "./aec-stereotypes";
import { mergeStereotypeCreative } from "./creative-burns-expansion";
import { getIndustryHatBurns } from "./industry/hatBurns";
import { getMeanModePool } from "./mean-mode-roasts";
import type { RolePoolKey } from "./roast-pools";

export function getBurnExtensions(
  roleKey: RolePoolKey,
  intensity: Intensity,
  industryHatId?: string,
): string[] {
  const roleStereo = AEC_STEREOTYPE_BURNS.byRole[roleKey]?.[intensity] ?? [];
  const universalStereo = AEC_STEREOTYPE_BURNS.universal[intensity] ?? [];
  const stereo = mergeStereotypeCreative(roleKey, intensity, [...roleStereo, ...universalStereo]);
  const mean = intensity === "nsfw" ? getMeanModePool(roleKey) : [];
  const hat =
    industryHatId && industryHatId.length > 0
      ? getIndustryHatBurns(industryHatId, intensity, "{name}")
      : [];
  return [...new Set([...hat, ...stereo, ...mean])];
}
