import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { corsHeaders } from "../roast/safety";

type SpeakRequest = { text: string };

const DEFAULT_INSTRUCTIONS =
  "Speak as CODiii, a cheeky young compliance mascot. Warm British-leaning accent, playful and confident, natural rhythm — not robotic or flat like Speak and Spell.";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 503,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "TTS not configured" }),
      };
    }

    const body = JSON.parse(event.body ?? "{}") as SpeakRequest;
    if (!body.text?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "text required" }),
      };
    }

    const voice = process.env.TTS_VOICE_ID ?? "coral";
    const instructions = process.env.TTS_INSTRUCTIONS ?? DEFAULT_INSTRUCTIONS;

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice,
        input: body.text.slice(0, 500),
        speed: 1.02,
        instructions,
      }),
    });

    if (!response.ok) {
      const legacy = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: voice === "coral" ? "shimmer" : voice,
          input: body.text.slice(0, 500),
          speed: 1.02,
        }),
      });
      if (!legacy.ok) {
        return {
          statusCode: 502,
          headers: corsHeaders(),
          body: JSON.stringify({ error: "TTS failed" }),
        };
      }
      const buffer = Buffer.from(await legacy.arrayBuffer());
      return {
        statusCode: 200,
        headers: { ...corsHeaders(), "Content-Type": "audio/mpeg" },
        isBase64Encoded: true,
        body: buffer.toString("base64"),
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        "Content-Type": "audio/mpeg",
      },
      isBase64Encoded: true,
      body: buffer.toString("base64"),
    };
  } catch {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "TTS error" }),
    };
  }
};
