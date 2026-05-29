import { defineFunction, secret } from "@aws-amplify/backend";

export const speak = defineFunction({
  name: "speak",
  entry: "./handler.ts",
  environment: {
    OPENAI_API_KEY: secret("OPENAI_API_KEY"),
    TTS_VOICE_ID: "nova",
  },
  timeoutSeconds: 30,
});
