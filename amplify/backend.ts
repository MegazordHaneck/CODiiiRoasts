import { defineBackend } from "@aws-amplify/backend";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { roast } from "./functions/roast/resource";
import { speak } from "./functions/speak/resource";

const backend = defineBackend({ roast, speak });

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

backend.addOutput({
  custom: {
    roastUrl: roastUrl.url,
    speakUrl: speakUrl.url,
  },
});
