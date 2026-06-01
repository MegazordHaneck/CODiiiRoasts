import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.SES_REGION ?? process.env.AWS_REGION ?? "ca-central-1" });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidShareEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim()) && email.length <= 254;
}

function buildRawMime(input: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachmentName: string;
  attachment: Buffer;
}): Buffer {
  const boundary = `----CODiii_${Date.now()}`;
  const chunks: string[] = [
    `From: ${input.from}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: multipart/alternative; boundary="alt"',
    "",
    "--alt",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    input.text,
    "",
    "--alt",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    input.html,
    "",
    "--alt--",
    "",
    `--${boundary}`,
    `Content-Type: image/png; name="${input.attachmentName}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${input.attachmentName}"`,
    "",
    input.attachment.toString("base64"),
    "",
    `--${boundary}--`,
  ];
  return Buffer.from(chunks.join("\r\n"));
}

export async function sendShareEmail(input: {
  to: string;
  name: string;
  caption: string;
  sharePageUrl: string;
  png: Buffer;
}): Promise<{ sent: boolean; error?: string }> {
  const from = process.env.SHARE_FROM_EMAIL?.trim();
  if (!from) {
    return { sent: false, error: "Email sender not configured" };
  }
  if (!isValidShareEmail(input.to)) {
    return { sent: false, error: "Invalid email address" };
  }

  const subject = `${input.name}, your CODiii roast is ready`;
  const text = [
    `Hi ${input.name},`,
    "",
    "Your roast card is attached. Share it on Instagram, LinkedIn, or Facebook:",
    input.sharePageUrl,
    "",
    input.caption,
    "",
    "— CODiii",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;max-width:520px">
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Your roast card is attached. You can also open it on your phone to share:</p>
      <p><a href="${escapeHtml(input.sharePageUrl)}">${escapeHtml(input.sharePageUrl)}</a></p>
      <pre style="white-space:pre-wrap;font-size:13px;background:#f4f4f5;padding:12px;border-radius:8px">${escapeHtml(input.caption)}</pre>
      <p style="color:#666;font-size:12px">— CODiii</p>
    </div>
  `;

  try {
    const raw = buildRawMime({
      from,
      to: input.to.trim(),
      subject,
      text,
      html,
      attachmentName: "codiii-roast.png",
      attachment: input.png,
    });

    await ses.send(
      new SendRawEmailCommand({
        Source: from,
        Destinations: [input.to.trim()],
        RawMessage: { Data: raw },
      }),
    );
    return { sent: true };
  } catch (e) {
    console.error("SES send failed", e);
    return { sent: false, error: e instanceof Error ? e.message : "Email send failed" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
