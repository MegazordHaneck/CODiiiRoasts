import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../roast/safety";
import { isValidShareEmail, sendShareEmail } from "./email";

const s3 = new S3Client({});
const TTL_SECONDS = 60 * 60 * 48;

type CreateBody = {
  pngBase64: string;
  caption: string;
  name: string;
  roast?: string;
  email?: string;
  appOrigin?: string;
};

type EmailBody = {
  action: "email";
  id: string;
  email: string;
  appOrigin?: string;
};

function sharePageUrl(appOrigin: string | undefined, id: string): string {
  const origin = (appOrigin ?? process.env.APP_ORIGIN ?? "").replace(/\/$/, "");
  const path = `/s/${id}`;
  return origin ? `${origin}${path}` : path;
}

async function loadShareMeta(id: string, bucket: string) {
  const metaRes = await s3.send(
    new GetObjectCommand({ Bucket: bucket, Key: `shares/${id}/meta.json` }),
  );
  const metaRaw = await metaRes.Body?.transformToString();
  if (!metaRaw) throw new Error("missing meta");
  return JSON.parse(metaRaw) as { caption: string; name: string; roast?: string };
}

async function loadSharePng(id: string, bucket: string): Promise<Buffer> {
  const imgRes = await s3.send(
    new GetObjectCommand({ Bucket: bucket, Key: `shares/${id}/card.png` }),
  );
  const bytes = await imgRes.Body?.transformToByteArray();
  if (!bytes?.length) throw new Error("missing image");
  return Buffer.from(bytes);
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  const bucket = process.env.SHARE_BUCKET_NAME;
  if (!bucket) {
    return {
      statusCode: 503,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Share storage not configured" }),
    };
  }

  try {
    if (event.requestContext.http.method === "GET") {
      const id = event.queryStringParameters?.id?.trim();
      if (!id || !/^[a-zA-Z0-9-]{8,64}$/.test(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ error: "id required" }),
        };
      }

      const meta = await loadShareMeta(id, bucket);

      const inline = event.queryStringParameters?.inline === "1";
      let imageUrl: string | undefined;
      let imageBase64: string | undefined;

      if (inline) {
        const png = await loadSharePng(id, bucket);
        imageBase64 = png.toString("base64");
      } else {
        imageUrl = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: bucket, Key: `shares/${id}/card.png` }),
          { expiresIn: 3600 },
        );
      }

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          id,
          name: meta.name,
          caption: meta.caption,
          roast: meta.roast ?? meta.caption,
          imageUrl,
          imageBase64,
        }),
      };
    }

    if (event.requestContext.http.method !== "POST") {
      return { statusCode: 405, headers: corsHeaders(), body: "" };
    }

    const body = JSON.parse(event.body ?? "{}") as CreateBody | EmailBody;

    if ("action" in body && body.action === "email") {
      const emailBody = body as EmailBody;
      const id = emailBody.id?.trim();
      const email = emailBody.email?.trim();
      if (!id || !/^[a-zA-Z0-9-]{8,64}$/.test(id) || !email || !isValidShareEmail(email)) {
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ error: "Valid id and email required" }),
        };
      }

      const meta = await loadShareMeta(id, bucket);
      const png = await loadSharePng(id, bucket);
      const pageUrl = sharePageUrl(emailBody.appOrigin, id);
      const result = await sendShareEmail({
        to: email,
        name: meta.name,
        caption: meta.caption,
        sharePageUrl: pageUrl,
        png,
      });

      return {
        statusCode: result.sent ? 200 : 503,
        headers: corsHeaders(),
        body: JSON.stringify({
          emailSent: result.sent,
          error: result.error,
        }),
      };
    }

    const createBody = body as CreateBody;
    if (!createBody.pngBase64?.trim() || !createBody.caption?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "pngBase64 and caption required" }),
      };
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const png = Buffer.from(createBody.pngBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    if (png.length > 4_500_000) {
      return {
        statusCode: 413,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "image too large" }),
      };
    }

    const meta = JSON.stringify({
      caption: createBody.caption.slice(0, 2000),
      roast: (createBody.roast ?? createBody.caption).slice(0, 2000),
      name: (createBody.name ?? "Guest").slice(0, 80),
      createdAt: new Date().toISOString(),
    });

    await Promise.all([
      s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `shares/${id}/card.png`,
          Body: png,
          ContentType: "image/png",
          CacheControl: "max-age=86400",
        }),
      ),
      s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `shares/${id}/meta.json`,
          Body: meta,
          ContentType: "application/json",
        }),
      ),
    ]);

    const pageUrl = sharePageUrl(createBody.appOrigin, id);
    let emailSent = false;
    let emailError: string | undefined;

    if (createBody.email?.trim() && isValidShareEmail(createBody.email)) {
      const parsedMeta = JSON.parse(meta) as { caption: string; name: string };
      const mail = await sendShareEmail({
        to: createBody.email.trim(),
        name: parsedMeta.name,
        caption: parsedMeta.caption,
        sharePageUrl: pageUrl,
        png,
      });
      emailSent = mail.sent;
      emailError = mail.error;
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        id,
        sharePagePath: `/s/${id}`,
        sharePageUrl: pageUrl,
        expiresInSeconds: TTL_SECONDS,
        emailSent,
        emailError,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "share failed" }),
    };
  }
};
