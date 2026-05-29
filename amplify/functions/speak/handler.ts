import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { corsHeaders } from "../roast/safety";

type SpeakRequest = { text: string };

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

    const voice = process.env.TTS_VOICE_ID ?? "nova";
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice,
        input: body.text.slice(0, 500),
        speed: 1.05,
      }),
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "TTS failed" }),
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
