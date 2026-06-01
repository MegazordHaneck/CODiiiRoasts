import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { censorProfanityForShare } from "./censor";
import {
  buildSystemPrompt,
  corsHeaders,
  isRoastRepetitive,
  isRoastSafe,
  resolveRoastRequest,
  type RoastRequest,
  type RoastResponse,
} from "./safety";

const FALLBACK: RoastResponse = {
  roast:
    "You work in AEC — so your calendar is RFIs, your model is lying, and the superintendent has a nickname for you.",
  violations: [
    "Detected: offline fallback mode",
    "Warning: design-bid-blame levels critical",
  ],
  fallback: true,
};

const ANGLES = [
  "Architect stereotype: render vs built, site visit cosplay, revision clouds, MEP in ceiling.",
  "Structural stereotype: SEE STRUCTURAL, stamp Friday, verify in field, details nobody builds.",
  "MEP stereotype: plenum war, ceiling height lie, Copy of Copy of Duct.",
  "GC stereotype: float ghosted, blame matrix, back-on-track fiction.",
  "BIM stereotype: LOD slide vs model, clash horror, federated model divorce.",
  "Owner stereotype: iconic vision / strip-mall budget, scope creep, VE kills facade.",
  "Contractor stereotype: RFI lifestyle, wrong sheet mobilization, change order arc.",
  "Specifier stereotype: 400-page door, or-equal trap, contractor shall verify.",
  "PM stereotype: meeting breeds meeting, RAID screams DESIGN, Gantt astrology.",
  "Contrast intro vs field reality — design-bid-blame.",
  "AHJ / permit / entitlement final boss.",
  "Friday 4:58 transmittal or IFC drop.",
  "Company name + discipline cliché together.",
  "If nuclear: two tropes, blunt punchline.",
  "If mean mode: 3-4 sentence vulgar prose — revision clouds, coordination WTF meeting, detail section punchline.",
  "Vary opener — not always 'that explains why'.",
];

async function callOpenAI(body: RoastRequest): Promise<RoastResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const exclude = body.excludeRoasts?.filter(Boolean).slice(-120) ?? [];
  const angle =
    body.variationHint ?? ANGLES[Math.floor(Math.random() * ANGLES.length)];

  const userContent = `Roast this attendee.

Name: ${body.name}
${body.company ? `Company: ${body.company}` : ""}
Profession / discipline (use as a real job title — never "a designs X"): ${body.role}
${body.introTranscript ? `\nExact words they said to CODiii:\n"${body.introTranscript}"\n\nYou MUST roast their actual work ontology (skyscrapers, bridges, BIM, GC, etc.) and company if stated. Use profession nouns (architect, superintendent) — never verb phrases like "designs skyscrapers" as their job title.` : ""}
${body.industryContext ? `\n${body.industryContext}\nUse their trade/discipline jargon naturally — spot elevation, invert, RFIs, submittals, etc.` : ""}
Intensity: ${body.intensity}
Creative angle for THIS roast only: ${angle}
${exclude.length ? `\nBANNED — do not repeat or paraphrase:\n${exclude.map((r) => `- ${r}`).join("\n")}` : ""}

Be specific to their intro. If intensity is nuclear, bring real heat.
${
  body.intensity === "nsfw"
    ? `\nMEAN MODE — match vulgar multi-sentence AEC prose (revision clouds / coordination meetings / detail sections energy). Profanity OK. Not sexual. Up to ~550 chars.`
    : ""
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature:
        body.intensity === "nsfw"
          ? 1.2
          : body.intensity === "nuclear"
            ? 1.15
            : body.intensity === "contractor"
              ? 1
              : 0.9,
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
    const raw = JSON.parse(event.body ?? "{}") as RoastRequest;
    const body = resolveRoastRequest(raw);
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

      if (!isRoastSafe(candidate.roast, body.intensity, body.safeMode)) {
        continue;
      }

      if (!isRoastRepetitive(candidate.roast, [...exclude, ...tried])) {
        result = candidate;
        break;
      }
      tried.push(candidate.roast);
    }

    if (!result || !isRoastSafe(result.roast, body.intensity, body.safeMode)) {
      result = FALLBACK;
    }

    result = {
      ...result,
      roast: censorProfanityForShare(result.roast),
    };

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
