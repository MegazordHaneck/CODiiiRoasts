declare module "@industry/AECOHats.mjs" {
  export type HatGroup = string;

  export interface IndustryHat {
    id: string;
    label: string;
    hatGroup: HatGroup;
    description?: string;
    keywords: string[];
    docClassFocus?: string[];
    disciplineFocus?: string[];
  }

  export const HATS: IndustryHat[];
  export const HAT_BY_ID: Record<string, IndustryHat>;
  export const HAT_GROUP_LABELS: Record<string, string>;
}

declare module "@industry/AECODimensionalOutputs.mjs" {
  export function dimensionalOutputsForHatGroup(hatGroup: string): string[];
  export const DIMENSIONAL_OUTPUT_GROUP_LABELS: Record<string, string>;
}
