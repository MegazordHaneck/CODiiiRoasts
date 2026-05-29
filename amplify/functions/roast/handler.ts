import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  buildSystemPrompt,
  corsHeaders,
  isRoastSafe,
  type RoastRequest,
  type RoastResponse,
} from "./safety";

const FALLBACK: RoastResponse = {
  roast: "Your coordination confidence is so low, even CODiii feels bad running the scan.",
  violations: [
    "Detected: offline fallback mode",
    "Warning: consultant confidence below measurable threshold",
  ],
  fallback: true,
};

async function callOpenAI(body: RoastRequest): Promise<RoastResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const userContent = `Roast this conference attendee:
Name: ${body.name}
Role: ${body.role}
${body.company ? `Company: ${body.company}` : ""}
Intensity: ${body.intensity}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: body.intensity === "nuclear" ? 0.95 : body.intensity === "contractor" ? 0.85 : 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(body.intensity, body.safeMode) },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const parsed = JSON.parse(data.choices[0].message.content) as RoastResponse;
  if (!parsed.roast || !Array.isArray(parsed.violations)) {
    throw new Error("Invalid roast JSON");
  }
  return parsed;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  try {
    const body = JSON.parse(event.body ?? "{}") as RoastRequest;
    if (!body.name?.trim() || !body.role?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "name and role required" }),
      };
    }

    let result: RoastResponse;
    try {
      result = await callOpenAI(body);
      if (!isRoastSafe(result.roast) && body.safeMode) {
        result = await callOpenAI({ ...body, safeMode: true });
      }
      if (!isRoastSafe(result.roast)) {
        result = FALLBACK;
      }
    } catch {
      result = FALLBACK;
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(result),
    };
  } catch {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify(FALLBACK),
    };
  }
};
