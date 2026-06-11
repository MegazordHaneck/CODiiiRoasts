import { buildShareCaption } from "./shareCaption";
import { resolveShareApiUrl } from "./amplifyOutputs";

export type ShareLinkResult = {
  id: string;
  sharePageUrl: string;
  emailSent?: boolean;
  emailError?: string;
};

export type SharePayload = {
  id: string;
  name: string;
  caption: string;
  roast: string;
  imageUrl: string;
};

export type SendShareEmailResult = {
  emailSent: boolean;
  error?: string;
};

/** Always use the booth’s own origin so the phone opens this app’s /s/:id page. */
export function buildSharePageUrl(shareId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/s/${shareId}`;
}

export async function createShareLink(input: {
  pngBase64: string;
  name: string;
  role: string;
  company?: string;
  roast: string;
  email?: string;
}): Promise<ShareLinkResult | null> {
  const apiUrl = await resolveShareApiUrl();
  if (!apiUrl) return null;

  const caption = buildShareCaption(input.roast);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pngBase64: input.pngBase64,
        caption,
        roast: input.roast,
        name: input.name,
        role: input.role,
        company: input.company?.trim() || undefined,
        email: input.email?.trim() || undefined,
        appOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      id: string;
      emailSent?: boolean;
      emailError?: string;
    };
    if (!data.id) return null;
    return {
      id: data.id,
      sharePageUrl: buildSharePageUrl(data.id),
      emailSent: data.emailSent,
      emailError: data.emailError,
    };
  } catch {
    return null;
  }
}

export async function sendShareEmail(shareId: string, email: string): Promise<SendShareEmailResult> {
  const apiUrl = await resolveShareApiUrl();
  if (!apiUrl) {
    return { emailSent: false, error: "Share service unavailable" };
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "email",
        id: shareId,
        email: email.trim(),
        appOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      }),
    });
    const data = (await res.json()) as { emailSent?: boolean; error?: string };
    if (!res.ok) {
      return { emailSent: false, error: data.error ?? "Could not send email" };
    }
    return { emailSent: !!data.emailSent, error: data.error };
  } catch {
    return { emailSent: false, error: "Could not send email" };
  }
}

export async function fetchSharePayload(shareId: string): Promise<SharePayload | null> {
  const apiUrl = await resolveShareApiUrl();
  if (!apiUrl || !shareId) return null;

  try {
    const url = new URL(apiUrl);
    url.searchParams.set("id", shareId);
    url.searchParams.set("inline", "1");
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = (await res.json()) as {
      id: string;
      name: string;
      caption: string;
      roast?: string;
      imageUrl?: string;
      imageBase64?: string;
    };
    const imageUrl = data.imageBase64
      ? `data:image/png;base64,${data.imageBase64}`
      : data.imageUrl;
    if (!imageUrl) return null;
    return {
      id: data.id,
      name: data.name,
      caption: data.caption,
      roast: data.roast ?? data.caption,
      imageUrl,
    };
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

export { resolveShareApiUrl } from "./amplifyOutputs";
