import { defineFunction, secret } from "@aws-amplify/backend";

export const roast = defineFunction({
  name: "roast",
  entry: "./handler.ts",
  environment: {
    OPENAI_API_KEY: secret("OPENAI_API_KEY"),
    ROAST_PROVIDER: "openai",
    NSFW_PIN: secret("NSFW_PIN"),
  },
  timeoutSeconds: 30,
});
