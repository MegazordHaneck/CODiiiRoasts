import { defineFunction, secret } from "@aws-amplify/backend";

export const speak = defineFunction({
  name: "speak",
  entry: "./handler.ts",
  environment: {
    OPENAI_API_KEY: secret("OPENAI_API_KEY"),
    TTS_VOICE_ID: "coral",
    TTS_INSTRUCTIONS:
      "Speak as CODiii, a cheeky young compliance mascot. Warm British-leaning accent, playful and confident, natural rhythm — not robotic.",
  },
  timeoutSeconds: 30,
});
