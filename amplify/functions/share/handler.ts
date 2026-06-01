import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../roast/safety";

const s3 = new S3Client({});
const TTL_SECONDS = 60 * 60 * 48;

type CreateBody = {
  pngBase64: string;
  caption: string;
  name: string;
  appOrigin?: string;
};

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

      const metaRes = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: `shares/${id}/meta.json` }),
      );
      const metaRaw = await metaRes.Body?.transformToString();
      if (!metaRaw) throw new Error("missing meta");
      const meta = JSON.parse(metaRaw) as { caption: string; name: string };

      const imageUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: bucket, Key: `shares/${id}/card.png` }),
        { expiresIn: 3600 },
      );

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          id,
          name: meta.name,
          caption: meta.caption,
          imageUrl,
        }),
      };
    }

    if (event.requestContext.http.method !== "POST") {
      return { statusCode: 405, headers: corsHeaders(), body: "" };
    }

    const body = JSON.parse(event.body ?? "{}") as CreateBody;
    if (!body.pngBase64?.trim() || !body.caption?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "pngBase64 and caption required" }),
      };
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const png = Buffer.from(body.pngBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    if (png.length > 4_500_000) {
      return {
        statusCode: 413,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "image too large" }),
      };
    }

    const meta = JSON.stringify({
      caption: body.caption.slice(0, 2000),
      name: (body.name ?? "Guest").slice(0, 80),
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

    const appOrigin = (body.appOrigin ?? process.env.APP_ORIGIN ?? "").replace(/\/$/, "");
    const sharePagePath = `/s/${id}`;

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        id,
        sharePagePath,
        sharePageUrl: appOrigin ? `${appOrigin.replace(/\/$/, "")}${sharePagePath}` : sharePagePath,
        expiresInSeconds: TTL_SECONDS,
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
