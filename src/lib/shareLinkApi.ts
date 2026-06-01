import { buildShareCaption } from "./shareCaption";

type Outputs = {
  custom?: {
    roastUrl?: string;
    speakUrl?: string;
    shareApiUrl?: string;
  };
};

let cachedOutputs: Outputs | null = null;

async function loadOutputs(): Promise<Outputs> {
  if (cachedOutputs) return cachedOutputs;
  try {
    const mod = await import("../../amplify_outputs.json");
    cachedOutputs = mod.default ?? mod;
    return cachedOutputs as Outputs;
  } catch {
    cachedOutputs = {};
    return cachedOutputs;
  }
}

export type ShareLinkResult = {
  id: string;
  sharePageUrl: string;
};

export type SharePayload = {
  id: string;
  name: string;
  caption: string;
  imageUrl: string;
};

export function buildSharePageUrl(shareId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/s/${shareId}`;
}

export async function createShareLink(input: {
  pngBase64: string;
  name: string;
  roast: string;
}): Promise<ShareLinkResult | null> {
  const outputs = await loadOutputs();
  const apiUrl = import.meta.env.VITE_SHARE_API_URL ?? outputs.custom?.shareApiUrl;
  if (!apiUrl) {
    return { id: "local", sharePageUrl: buildSharePageUrl("local") };
  }

  const caption = buildShareCaption(input.roast);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pngBase64: input.pngBase64,
        caption,
        name: input.name,
        appOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      id: string;
      sharePageUrl?: string;
      sharePagePath?: string;
    };
    const sharePageUrl =
      data.sharePageUrl ??
      (data.sharePagePath?.startsWith("http")
        ? data.sharePagePath
        : buildSharePageUrl(data.id));
    return { id: data.id, sharePageUrl };
  } catch {
    return null;
  }
}

export async function fetchSharePayload(shareId: string): Promise<SharePayload | null> {
  const outputs = await loadOutputs();
  const apiUrl = import.meta.env.VITE_SHARE_API_URL ?? outputs.custom?.shareApiUrl;
  if (!apiUrl || shareId === "local") return null;

  try {
    const url = new URL(apiUrl);
    url.searchParams.set("id", shareId);
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return (await res.json()) as SharePayload;
  } catch {
    return null;
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result.split(",")[1] ?? result);
        return;
      }
      reject(new Error("read failed"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
