export type AmplifyCustomOutputs = {
  roastUrl?: string;
  speakUrl?: string;
  shareApiUrl?: string;
};

declare const __CODIII_ROAST_URL__: string | undefined;
declare const __CODIII_SPEAK_URL__: string | undefined;
declare const __CODIII_SHARE_URL__: string | undefined;

const STORAGE_KEY = "codiii-amplify-custom";

const BAKED: AmplifyCustomOutputs = {
  roastUrl: typeof __CODIII_ROAST_URL__ !== "undefined" ? __CODIII_ROAST_URL__ : "",
  speakUrl: typeof __CODIII_SPEAK_URL__ !== "undefined" ? __CODIII_SPEAK_URL__ : "",
  shareApiUrl: typeof __CODIII_SHARE_URL__ !== "undefined" ? __CODIII_SHARE_URL__ : "",
};

let importedOutputs: { custom?: AmplifyCustomOutputs } | null = null;
let runtimeFetchDone = false;
let runtimeOutputs: AmplifyCustomOutputs = {};

function trimUrl(v?: string): string | undefined {
  const t = v?.trim();
  return t ? t : undefined;
}

function fromStorage(): AmplifyCustomOutputs | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AmplifyCustomOutputs;
  } catch {
    return null;
  }
}

function saveStorage(custom: AmplifyCustomOutputs) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch {
    /* quota */
  }
}

async function loadImportedOutputs(): Promise<{ custom?: AmplifyCustomOutputs }> {
  if (importedOutputs) return importedOutputs;
  try {
    const mod = await import("../../amplify_outputs.json");
    importedOutputs = (mod.default ?? mod) as { custom?: AmplifyCustomOutputs };
  } catch {
    importedOutputs = {};
  }
  return importedOutputs;
}

async function fetchRuntimeOutputs(): Promise<AmplifyCustomOutputs> {
  if (runtimeFetchDone) return runtimeOutputs;
  runtimeFetchDone = true;
  try {
    const base = import.meta.env.BASE_URL ?? "/";
    const res = await fetch(`${base}amplify_outputs.json`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { custom?: AmplifyCustomOutputs };
      runtimeOutputs = json.custom ?? {};
      if (runtimeOutputs.roastUrl || runtimeOutputs.shareApiUrl || runtimeOutputs.speakUrl) {
        saveStorage(runtimeOutputs);
      }
    }
  } catch {
    runtimeOutputs = {};
  }
  return runtimeOutputs;
}

async function resolveCustom(): Promise<AmplifyCustomOutputs> {
  const stored = fromStorage();
  const imported = (await loadImportedOutputs()).custom ?? {};
  const runtime = await fetchRuntimeOutputs();

  const merged: AmplifyCustomOutputs = {
    roastUrl:
      trimUrl(import.meta.env.VITE_ROAST_URL) ??
      trimUrl(BAKED.roastUrl) ??
      trimUrl(imported.roastUrl) ??
      trimUrl(runtime.roastUrl) ??
      trimUrl(stored?.roastUrl),
    speakUrl:
      trimUrl(import.meta.env.VITE_SPEAK_URL) ??
      trimUrl(BAKED.speakUrl) ??
      trimUrl(imported.speakUrl) ??
      trimUrl(runtime.speakUrl) ??
      trimUrl(stored?.speakUrl),
    shareApiUrl:
      trimUrl(import.meta.env.VITE_SHARE_API_URL) ??
      trimUrl(BAKED.shareApiUrl) ??
      trimUrl(imported.shareApiUrl) ??
      trimUrl(runtime.shareApiUrl) ??
      trimUrl(stored?.shareApiUrl),
  };

  if (merged.roastUrl || merged.shareApiUrl || merged.speakUrl) {
    saveStorage(merged);
  }

  return merged;
}

export async function resolveRoastUrl(): Promise<string | undefined> {
  return (await resolveCustom()).roastUrl;
}

export async function resolveSpeakUrl(): Promise<string | undefined> {
  return (await resolveCustom()).speakUrl;
}

export async function resolveShareApiUrl(): Promise<string | undefined> {
  return (await resolveCustom()).shareApiUrl;
}

export async function resolveAllApiUrls(): Promise<AmplifyCustomOutputs> {
  return resolveCustom();
}
