import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  buildSystemPrompt,
  corsHeaders,
  isRoastRepetitive,
  isRoastSafe,
  type RoastRequest,
  type RoastResponse,
} from "./safety";

const FALLBACK: RoastResponse = {
  roast:
    "You work in AEC — so your calendar is just RFIs wearing business casual and calling it a plan.",
  violations: [
    "Detected: offline fallback mode",
    "Warning: schedule fiction above safe limits",
  ],
  fallback: true,
};

const ANGLES = [
  "Use a specific document or deliverable they would actually produce.",
  "Contrast what they claimed in intro vs what the job site actually sees.",
  "One construction-site metaphor, then the insult.",
  "Roast schedule or coordination fantasy — no meta CODiii jokes.",
  "Reference their company or intro quote directly.",
  "Fake praise, then twist — expo crowd energy.",
  "Invent a funny fake metric (RFI velocity, redline G-force).",
  "Roast Friday 4:58 PM email culture.",
  "Target handoffs between design, coordination, and field.",
  "If nuclear: blunt and memorable, no soft ending.",
  "Vary opener — not always 'that explains why'.",
  "Make it feel written only for this person.",
];

async function callOpenAI(body: RoastRequest): Promise<RoastResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const exclude = body.excludeRoasts?.filter(Boolean).slice(-120) ?? [];
  const angle =
    body.variationHint ?? ANGLES[Math.floor(Math.random() * ANGLES.length)];

  const userContent = `Roast this attendee.

Name: ${body.name}
Role: ${body.role}
${body.company ? `Company: ${body.company}` : ""}
${body.introTranscript ? `What they said to CODiii: "${body.introTranscript}"` : ""}
Intensity: ${body.intensity}
Creative angle for THIS roast only: ${angle}
${exclude.length ? `\nBANNED — do not repeat or paraphrase:\n${exclude.map((r) => `- ${r}`).join("\n")}` : ""}

Be specific to their intro. If intensity is nuclear, bring real heat.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature:
        body.intensity === "nuclear" ? 1.15 : body.intensity === "contractor" ? 1 : 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
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
    const hasIntro = !!body.introTranscript?.trim();
    if (!hasIntro && (!body.name?.trim() || !body.role?.trim())) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "intro or name and role required" }),
      };
    }

    const exclude = body.excludeRoasts ?? [];
    const tried: string[] = [];
    let result: RoastResponse | null = null;

    for (let attempt = 0; attempt < 7; attempt++) {
      const candidate = await callOpenAI({
        ...body,
        variationHint: ANGLES[attempt % ANGLES.length],
        excludeRoasts: [...exclude, ...tried],
      });

      if (!isRoastSafe(candidate.roast) && body.safeMode) {
        continue;
      }
      if (!isRoastSafe(candidate.roast)) {
        break;
      }

      if (!isRoastRepetitive(candidate.roast, [...exclude, ...tried])) {
        result = candidate;
        break;
      }
      tried.push(candidate.roast);
    }

    if (!result || !isRoastSafe(result.roast)) {
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
