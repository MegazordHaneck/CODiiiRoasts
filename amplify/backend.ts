import { defineBackend } from "@aws-amplify/backend";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { roast } from "./functions/roast/resource";
import { share } from "./functions/share/resource";
import { speak } from "./functions/speak/resource";

const backend = defineBackend({ roast, speak, share });

const shareStack = backend.createStack("share-storage");
const shareBucket = new Bucket(shareStack, "RoastShareBucket", {
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
  lifecycleRules: [{ expiration: Duration.days(2) }],
  cors: [
    {
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
      maxAge: 3600,
    },
  ],
});

shareBucket.grantReadWrite(backend.share.resources.lambda);

const leadsTable = new Table(shareStack, "RoastLeadsTable", {
  partitionKey: { name: "shareId", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.RETAIN,
});

leadsTable.grantReadWriteData(backend.share.resources.lambda);

backend.share.addEnvironment("SHARE_BUCKET_NAME", shareBucket.bucketName);
backend.share.addEnvironment("LEADS_TABLE_NAME", leadsTable.tableName);
backend.share.addEnvironment(
  "APP_ORIGIN",
  process.env.APP_ORIGIN ?? "https://roasts.codiii.com",
);
backend.share.addEnvironment("SHARE_FROM_EMAIL", process.env.SHARE_FROM_EMAIL ?? "");
backend.share.addEnvironment("SES_REGION", process.env.SES_REGION ?? "ca-central-1");
backend.share.addEnvironment(
  "SLACK_LEADS_WEBHOOK_URL",
  process.env.SLACK_LEADS_WEBHOOK_URL ?? "",
);

backend.share.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"],
  }),
);

const BOOTH_ORIGINS = [
  "https://roasts.codiii.com",
  "https://main.draz2nrbxwj96.amplifyapp.com",
  "http://localhost:5173",
];

function functionUrlCors(methods: HttpMethod[]) {
  return {
    allowedOrigins: BOOTH_ORIGINS,
    allowedMethods: methods,
    allowedHeaders: ["*"],
    maxAge: Duration.hours(1),
  };
}

const roastUrl = backend.roast.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: functionUrlCors([HttpMethod.POST]),
});

const speakUrl = backend.speak.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: functionUrlCors([HttpMethod.POST]),
});

const shareApiUrl = backend.share.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: functionUrlCors([HttpMethod.GET, HttpMethod.POST]),
});

backend.addOutput({
  custom: {
    roastUrl: roastUrl.url,
    speakUrl: speakUrl.url,
    shareApiUrl: shareApiUrl.url,
  },
});
