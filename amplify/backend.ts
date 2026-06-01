import { defineBackend } from "@aws-amplify/backend";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
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
});

shareBucket.grantReadWrite(backend.share.resources.lambda);

backend.share.addEnvironment("SHARE_BUCKET_NAME", shareBucket.bucketName);
backend.share.addEnvironment(
  "APP_ORIGIN",
  process.env.APP_ORIGIN ?? "https://main.draz2nrbxwj96.amplifyapp.com",
);

const roastUrl = backend.roast.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

const speakUrl = backend.speak.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

const shareApiUrl = backend.share.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.GET, HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

backend.addOutput({
  custom: {
    roastUrl: roastUrl.url,
    speakUrl: speakUrl.url,
    shareApiUrl: shareApiUrl.url,
  },
});
