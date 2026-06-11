import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { notifySlackLead } from "./slack";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export type LeadInput = {
  shareId: string;
  name: string;
  role: string;
  company?: string;
  email?: string;
  sharePageUrl?: string;
};

function tableName(): string | undefined {
  return process.env.LEADS_TABLE_NAME?.trim() || undefined;
}

/** Persist booth attendee info when a share card is published. */
export async function saveLead(input: LeadInput): Promise<void> {
  const table = tableName();
  if (!table) return;

  const now = new Date().toISOString();
  const email = input.email?.trim().slice(0, 254);

  const name = (input.name || "Guest").trim().slice(0, 80);
  const role = (input.role || "").trim().slice(0, 120);
  const company = input.company?.trim().slice(0, 120);

  try {
    await doc.send(
      new PutCommand({
        TableName: table,
        Item: {
          shareId: input.shareId,
          name,
          role,
          ...(company ? { company } : {}),
          ...(email ? { email, emailCapturedAt: now } : {}),
          createdAt: now,
        },
      }),
    );
  } catch (e) {
    console.error("saveLead failed", e);
    return;
  }

  await notifySlackLead({
    kind: "new_lead",
    name,
    role,
    company,
    email,
    shareId: input.shareId,
    sharePageUrl: input.sharePageUrl,
  });
}

/** Add email when the attendee requests the roast card by email. */
export async function captureLeadEmail(
  shareId: string,
  email: string,
  context?: { name: string; role?: string; company?: string; sharePageUrl?: string },
): Promise<void> {
  const table = tableName();
  if (!table) return;

  const now = new Date().toISOString();

  try {
    await doc.send(
      new UpdateCommand({
        TableName: table,
        Key: { shareId },
        UpdateExpression: "SET email = :email, emailCapturedAt = :at",
        ExpressionAttributeValues: {
          ":email": email.trim().slice(0, 254),
          ":at": now,
        },
      }),
    );
  } catch (e) {
    console.error("captureLeadEmail failed", e);
    return;
  }

  if (context) {
    await notifySlackLead({
      kind: "email_added",
      name: context.name,
      role: context.role ?? "",
      company: context.company,
      email: email.trim().slice(0, 254),
      shareId,
      sharePageUrl: context.sharePageUrl,
    });
  }
}
