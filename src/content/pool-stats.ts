import { getBurnExtensions } from "./burn-extensions";
import { getTemplatePool, type RolePoolKey } from "./roast-pools";

const ROLES: RolePoolKey[] = [
  "default",
  "architect",
  "engineer",
  "contractor",
  "gc",
  "owner",
  "bim manager",
  "pm",
  "specifier",
];

export function countOfflinePoolLines(roleKey: RolePoolKey = "default"): number {
  const intensities = ["light", "contractor", "nuclear", "nsfw"] as const;
  return intensities.reduce(
    (sum, i) =>
      sum + new Set([...getTemplatePool(roleKey, i), ...getBurnExtensions(roleKey, i, undefined)]).size,
    0,
  );
}

export function countMeanModeLines(roleKey: RolePoolKey = "architect"): number {
  return getBurnExtensions(roleKey, "nsfw").length;
}

export function totalBoothLines(): number {
  return ROLES.reduce((sum, r) => sum + countOfflinePoolLines(r), 0);
}
