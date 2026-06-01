import { defineFunction } from "@aws-amplify/backend";

export const share = defineFunction({
  name: "share",
  entry: "./handler.ts",
  timeoutSeconds: 30,
  memoryMB: 512,
});
