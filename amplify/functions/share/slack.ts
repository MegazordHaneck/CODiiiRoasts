export type SlackLeadPayload = {
  kind: "new_lead" | "email_added";
  name: string;
  role: string;
  company?: string;
  email?: string;
  shareId: string;
  sharePageUrl?: string;
};

function webhookUrl(): string | undefined {
  return process.env.SLACK_LEADS_WEBHOOK_URL?.trim() || undefined;
}

function formatMessage(payload: SlackLeadPayload): string {
  const title =
    payload.kind === "new_lead"
      ? "New CODiii Roasts booth lead"
      : "Booth lead — email captured";

  const emailLine = payload.email
    ? payload.email
    : payload.kind === "new_lead"
      ? "_not provided yet_"
      : "—";

  const lines = [
    `*${title}*`,
    `• *Name:* ${payload.name}`,
    `• *Title:* ${payload.role || "—"}`,
    `• *Company:* ${payload.company || "—"}`,
    `• *Email:* ${emailLine}`,
  ];

  if (payload.sharePageUrl) {
    lines.push(`• *Share card:* ${payload.sharePageUrl}`);
  }

  return lines.join("\n");
}

/** Post lead info to Slack via incoming webhook (no-op if URL unset). */
export async function notifySlackLead(payload: SlackLeadPayload): Promise<void> {
  const webhook = webhookUrl();
  if (!webhook) return;

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: formatMessage(payload),
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Slack notify failed", res.status, body.slice(0, 200));
    }
  } catch (e) {
    console.error("Slack notify error", e);
  }
}
