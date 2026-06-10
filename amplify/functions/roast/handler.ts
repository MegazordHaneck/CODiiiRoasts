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
    "Your calendar is RFIs, your model is lying, and the superintendent definitely has a nickname for you.",
  violations: [
    "Detected: offline fallback mode",
    "Warning: design-bid-blame levels critical",
  ],
  fallback: true,
};

const ANGLES = [
  "Architect: render people on roof, no headroom in section, Horizon/Nexus name, revision clouds.",
  "Architect: curtain wall jewelry, waterproofing rumor, floating stair, VE killed flashing.",
  "Architect: site visit once for photos, charrette spa day, door hardware schedule novel.",
  "Structural: SEE STRUCTURAL shrug, stamp Friday 4:58, Monday inherits deflection.",
  "Structural: calcs church — sheet fan fiction, verify in field autobiography.",
  "Structural: pin connection religion, connection detail novel — built connection improv.",
  "MEP design: plenum war casualties, ceiling height lie, Copy of Copy of Duct.",
  "MEP design: equipment schedule fiction, NOT FOR CONSTRUCTION honesty, RCP smuggler energy.",
  "MEP design: load calc assumptions — VE deleted half, panel room sized for schedule not heat.",
  "BIM/VDC: LOD 500 slide vs LOD 200 ceiling, clash report 9000 issues three closed.",
  "BIM/VDC: federated model divorce, BEP folklore, issue tracker screaming in columns.",
  "BIM/VDC: Navisworks group therapy, clash names Pipe vs Beam of Regret, 4D vs field.",
  "Superintendent: daily report religion waiting on design, RFI photo sheet A-101 still wrong.",
  "Superintendent: tape measure gospel vs architect sketch, sequence plan vs weather plot twist.",
  "Superintendent: mobilized on wrong revision, field sketch wrong but built, toolbox talk therapy.",
  "PM/CM: meetings about meetings, Gantt green field red, RAID screams DESIGN.",
  "PM/CM: lookahead astrology with logos, float ghosted, recovery narrative with catering.",
  "PM/CM: blame matrix facilitation, sell certainty deliver suspense, OAC deck RFIs in business casual.",
  "GC/precon: buyout assumption folklore, trade boundary gaps, bid spread shock.",
  "Civil: invert spot lied — camera didn't, grading poetry as-built mud sequel.",
  "Civil: utility phone tree of despair, entitlement timeline fan fiction, BMP vs rain undefeated.",
  "Envelope: air barrier rumor at laps, mockup passed field failed, water left a review.",
  "Regulatory/AHJ: petty redlines undefeated, plan check is the real schedule, final boss energy.",
  "Commissioning: functional test surfaces design sins, Cx checklist epic, decommission optimism.",
  "Sustainability: LEED Platinum slides Bronze submittals, energy model poetry meter prose.",
  "Estimator: takeoff assumes drawing truth, bid art buyout tragedy, assumptions folder folklore.",
  "MEP trade: own the plenum architect thought decorative, TAB truth coordination fiction.",
  "Owner: iconic vision strip-mall budget, scope creep cardio, VE smile six weeks pain.",
  "Specifier: Division 08 door religion, or-equal trap, contractor shall verify goodbye.",
  "Contrast intro vs field reality — design-bid-blame.",
  "Friday 4:58 transmittal or IFC drop.",
  "Company name + discipline cliché together.",
  "If nuclear: one trope, one blunt punchline — single sentence.",
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
${body.industryContext ? `\n${body.industryContext}\n\nROLE FIDELITY: The roast must target THIS hat's actual work (GRILL THEM ON). Never use tropes from the DO NOT list. One sentence. Use their jargon only where it fits this role.` : ""}
Intensity: ${body.intensity}
Creative angle for THIS roast only: ${angle}
${exclude.length ? `\nBANNED — do not repeat or paraphrase:\n${exclude.map((r) => `- ${r}`).join("\n")}` : ""}

Be specific to their intro. If intensity is nuclear, bring real heat.
${
  body.intensity === "nsfw"
    ? `\nMEAN MODE — one vulgar sentence only (coordination meeting / detail section energy). Profanity OK. Not sexual. Land the full punchline.`
    : `\nONE sentence only — land the full punchline; no setup paragraph, no "And your…" second beat.`
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
